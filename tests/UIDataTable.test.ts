import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import UIDataTable from '../src/components/data-table/UIDataTable.vue'
import type { UIDataTableColumn } from '../src/components/data-table/types'

interface Person { id: string; name: string; count: number; locked?: boolean }
const data: Person[] = [
  { id: 'b', name: 'Beta', count: 20 },
  { id: 'a', name: 'Alpha', count: 3 },
  { id: 'c', name: 'Charlie', count: 100, locked: true },
  { id: 'd', name: 'Delta', count: 8 },
]
const columns: UIDataTableColumn<Person>[] = [{ accessorKey: 'name', header: '이름' }, { accessorKey: 'count', header: '건수', meta: { align: 'end' } }]
const defaults = { data, columns, label: '직원', getRowId: (row: Person) => row.id, getRowLabel: (row: Person) => row.name }
const create = (props = {}) => mount(UIDataTable<Person>, { props: { ...defaults, ...props } })
enableAutoUnmount(afterEach)
const names = (wrapper: ReturnType<typeof create>) => wrapper.findAll('tbody tr').map(row => row.findAll('td')[0]!.text())
const button = (wrapper: ReturnType<typeof create>, label: string) => wrapper.findAll('button').find(item => item.text() === label)!

describe('UIDataTable', () => {
  it('uses server totals and preserves the order and content of the supplied page', async () => {
    const wrapper = create({ mode: 'server', totalRows: 8, data: [data[0]!, data[1]!], pagination: { pageIndex: 2, pageSize: 2 }, searchable: true })
    expect(names(wrapper)).toEqual(['Beta', 'Alpha'])
    expect(wrapper.get('[role="status"]').text()).toContain('총 8건 중 5–6건')
    await button(wrapper, '다음').trigger('click')
    expect(wrapper.emitted('update:pagination')?.at(-1)).toEqual([{ pageIndex: 3, pageSize: 2 }])
    await wrapper.get('input[type="search"]').setValue('remote-only')
    expect(wrapper.emitted('update:globalFilter')?.at(-1)).toEqual(['remote-only'])
    expect(wrapper.emitted('update:pagination')?.at(-1)).toEqual([{ pageIndex: 0, pageSize: 2 }])
    await wrapper.get('button[aria-label="이름: 오름차순 정렬"]').trigger('click')
    expect(wrapper.emitted('update:sorting')?.at(-1)).toEqual([[{ id: 'name', desc: false }]])
    expect(names(wrapper)).toEqual(['Beta', 'Alpha'])
  })

  it('retains the requested server page during loading and error, then clamps on a completed response', async () => {
    const wrapper = create({ mode: 'server', totalRows: 0, data: [], loading: true, pagination: { pageIndex: 3, pageSize: 2 }, searchable: true })
    expect(wrapper.emitted('update:pagination')).toBeUndefined()
    expect(wrapper.get<HTMLInputElement>('input[type="search"]').element.disabled).toBe(false)
    await wrapper.setProps({ loading: false, error: '실패' })
    expect(wrapper.emitted('update:pagination')).toBeUndefined()
    await button(wrapper, '다시 시도').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
    await wrapper.setProps({ error: '', totalRows: 3 })
    expect(wrapper.emitted('update:pagination')?.at(-1)).toEqual([{ pageIndex: 1, pageSize: 2 }])
  })

  it('keeps selections from other server pages without counting them in the current response', async () => {
    const wrapper = create({
      mode: 'server', totalRows: 8, data: [data[2]!, data[3]!], selectable: true,
      rowSelection: { b: true }, canSelectRow: (row: Person) => !row.locked,
    })
    await wrapper.get('thead input').setValue(true)
    expect(wrapper.emitted('update:rowSelection')?.at(-1)).toEqual([{ b: true, d: true }])
    expect(wrapper.get('[role="status"]').text()).toContain('현재 응답에서 1건 선택')
    await wrapper.setProps({ data: [data[0]!] })
    expect(wrapper.get<HTMLInputElement>('input[aria-label="Beta 선택"]').element.checked).toBe(true)
    expect(wrapper.get('[role="status"]').text()).toContain('현재 응답에서 1건 선택')
  })

  it('renders native table semantics and sorts text/numbers without changing input data', async () => {
    const wrapper = create()
    expect(wrapper.get('caption').text()).toBe('직원')
    expect(wrapper.get('th').attributes('scope')).toBe('col')
    await wrapper.get('button[aria-label="이름: 오름차순 정렬"]').trigger('click')
    expect(names(wrapper)).toEqual(['Alpha', 'Beta', 'Charlie', 'Delta'])
    expect(wrapper.get('th').attributes('aria-sort')).toBe('ascending')
    await wrapper.get('button[aria-label="이름: 내림차순 정렬"]').trigger('click')
    expect(names(wrapper)).toEqual(['Delta', 'Charlie', 'Beta', 'Alpha'])
    await wrapper.get('button[aria-label="이름: 정렬 해제"]').trigger('click')
    expect(names(wrapper)).toEqual(['Beta', 'Alpha', 'Charlie', 'Delta'])
    await wrapper.get('button[aria-label="건수: 오름차순 정렬"]').trigger('click')
    expect(names(wrapper)).toEqual(['Alpha', 'Delta', 'Beta', 'Charlie'])
    expect(data.map(row => row.id)).toEqual(['b', 'a', 'c', 'd'])
  })

  it('filters and resets pagination, clamps shrinking data and changes page size', async () => {
    const wrapper = create({ searchable: true, pagination: { pageIndex: 0, pageSize: 2 } })
    await button(wrapper, '다음').trigger('click')
    expect(names(wrapper)).toEqual(['Charlie', 'Delta'])
    await wrapper.get('input[type="search"]').setValue('alpha')
    expect(names(wrapper)).toEqual(['Alpha'])
    expect(wrapper.get('[role="status"]').text()).toContain('총 1건 중 1–1건')
    await wrapper.get('input[type="search"]').setValue('missing')
    expect(wrapper.get('tbody').text()).toContain('검색 결과가 없습니다.')
    expect(wrapper.get('[role="status"]').text()).toContain('0–0건')
    await wrapper.get('input[type="search"]').setValue('')
    await button(wrapper, '다음').trigger('click')
    await wrapper.setProps({ data: data.slice(0, 1) })
    expect(names(wrapper)).toEqual(['Beta'])
    await wrapper.get('select').setValue('20')
    expect(wrapper.emitted('update:pagination')?.at(-1)).toEqual([{ pageIndex: 0, pageSize: 20 }])
  })

  it('selects only enabled rows on the current page and preserves business IDs across sorting and filters', async () => {
    const wrapper = create({ selectable: true, searchable: true, pagination: { pageIndex: 0, pageSize: 2 }, canSelectRow: (row: Person) => !row.locked })
    const all = wrapper.get<HTMLInputElement>('thead input')
    await wrapper.get('input[aria-label="Beta 선택"]').setValue(true)
    expect(all.element.indeterminate).toBe(true)
    await all.setValue(true)
    expect(wrapper.emitted('update:rowSelection')?.at(-1)).toEqual([{ b: true, a: true }])
    await button(wrapper, '다음').trigger('click')
    expect(wrapper.get('input[aria-label="Charlie 선택"]').attributes('disabled')).toBeDefined()
    await all.setValue(true)
    expect(wrapper.emitted('update:rowSelection')?.at(-1)).toEqual([{ b: true, a: true, d: true }])
    await wrapper.get('input[type="search"]').setValue('Beta')
    expect(wrapper.get<HTMLInputElement>('input[aria-label="Beta 선택"]').element.checked).toBe(true)
    expect(wrapper.get('[role="status"]').text()).toContain('3건 선택')
    await all.setValue(false)
    expect(wrapper.emitted('update:rowSelection')?.at(-1)).toEqual([{ a: true, d: true }])
    await wrapper.setProps({ data: [data[1]!] })
    expect(wrapper.get('[role="status"]').text()).toContain('1건 선택')
  })

  it('honors controlled state updates and emits concrete next values', async () => {
    const wrapper = mount(UIDataTable<Person>, { props: { ...defaults, sorting: [], pagination: { pageIndex: 0, pageSize: 2 }, rowSelection: {}, selectable: true, 'onUpdate:sorting': () => {}, 'onUpdate:pagination': () => {}, 'onUpdate:rowSelection': () => {} } })
    await wrapper.get('.ui-data-table-sort').trigger('click')
    expect(wrapper.emitted('update:sorting')?.[0]).toEqual([[{ id: 'name', desc: false }]])
    expect(wrapper.findAll('tbody tr')[0]!.text()).toContain('Beta')
    await wrapper.setProps({ sorting: [{ id: 'name', desc: false }] })
    expect(wrapper.findAll('tbody tr')[0]!.text()).toContain('Alpha')
    await button(wrapper, '다음').trigger('click')
    expect(wrapper.emitted('update:pagination')?.at(-1)).toEqual([{ pageIndex: 1, pageSize: 2 }])
    await wrapper.setProps({ pagination: { pageIndex: 1, pageSize: 2 } })
    expect(wrapper.findAll('tbody tr')[0]!.text()).toContain('Charlie')
    await wrapper.get('input[aria-label="Charlie 선택"]').setValue(true)
    expect(wrapper.emitted('update:rowSelection')?.at(-1)).toEqual([{ c: true }])
    expect(wrapper.get<HTMLInputElement>('input[aria-label="Charlie 선택"]').element.checked).toBe(false)
    await wrapper.setProps({ rowSelection: { d: true } })
    expect(wrapper.get<HTMLInputElement>('input[aria-label="Delta 선택"]').element.checked).toBe(true)
  })

  it('distinguishes loading, error, empty states and exposes retry', async () => {
    const wrapper = create({ selectable: true, loading: true })
    expect(wrapper.get('table').attributes('aria-busy')).toBe('true')
    expect(wrapper.get('tbody').text()).toContain('불러오는 중')
    expect(wrapper.get('thead input').attributes('disabled')).toBeDefined()
    await wrapper.setProps({ loading: false, error: '네트워크 오류' })
    await button(wrapper, '다시 시도').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
    await wrapper.setProps({ error: '', data: [] })
    expect(wrapper.get('tbody').text()).toContain('등록된 데이터가 없습니다.')
    expect(wrapper.get('tbody td').attributes('colspan')).toBe('3')
  })

  it('renders custom cells and handles invalid pagination without blank pages', async () => {
    const wrapper = mount(UIDataTable<Person>, { props: { ...defaults, pagination: { pageIndex: 99, pageSize: 0 } }, slots: { 'cell-name': '<template #default="{ row }"><strong>{{ row.name }}</strong></template>' } })
    await nextTick()
    expect(wrapper.get('tbody strong').text()).toBe('Delta')
    expect(wrapper.emitted('update:pagination')?.[0]).toEqual([{ pageIndex: 3, pageSize: 1 }])
    await wrapper.setProps({ paginated: false })
    expect(wrapper.findAll('tbody tr')).toHaveLength(4)
    expect(wrapper.find('select').exists()).toBe(false)
  })
})
