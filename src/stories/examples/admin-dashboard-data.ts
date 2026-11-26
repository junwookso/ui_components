import type { UIChipProps, UIDataTableColumn, UIListItem } from '../../index'

export const sampleDate = '2026-11-23'
export const teams = ['플랫폼팀', '서비스운영팀', '보안팀']

export const statusVariants = {
  '접수': 'info',
  '처리 중': 'warning',
  '완료': 'success',
} satisfies Record<string, UIChipProps['variant']>

export interface Request {
  id: string
  title: string
  team: string
  date: string
  status: keyof typeof statusVariants
  description: string
}

export const initialRequests: Request[] = [
  { id: 'REQ-1048', title: '업무 포털 열람 권한 추가', team: '플랫폼팀', date: sampleDate, status: '접수', description: '운영지원 담당자가 업무 포털 접수 내역을 확인할 수 있도록 열람 권한을 추가해 주세요.' },
  { id: 'REQ-1047', title: '정기 보고서 발송 시간 변경', team: '서비스운영팀', date: sampleDate, status: '처리 중', description: '월요일 정기 보고서 발송 시각을 오전 9시로 바꿔 주세요.' },
  { id: 'REQ-1046', title: '외부 협력사 계정 만료 검토', team: '보안팀', date: '2026-11-22', status: '접수', description: '이번 달에 만료되는 협력사 계정의 연장 필요 여부를 확인해 주세요.' },
  { id: 'REQ-1045', title: '파일 보관 정책 적용', team: '플랫폼팀', date: '2026-11-22', status: '완료', description: '공유 저장소의 신규 파일 보관 기간을 적용해 주세요.' },
  { id: 'REQ-1044', title: '휴일 서비스 공지 게시', team: '서비스운영팀', date: '2026-11-21', status: '완료', description: '휴일 중 지원 가능 시간을 서비스 공지에 게시해 주세요.' },
  { id: 'REQ-1043', title: '분기별 접근 기록 점검', team: '보안팀', date: '2026-11-20', status: '처리 중', description: '분기별 접근 기록에 점검이 필요한 항목이 있는지 확인해 주세요.' },
  { id: 'REQ-1042', title: '서비스 상태 페이지 구독 정리', team: '서비스운영팀', date: '2026-11-20', status: '완료', description: '상태 페이지의 운영 담당자 구독 목록을 갱신해 주세요.' },
  { id: 'REQ-1041', title: '공용 저장소 사용량 확인', team: '플랫폼팀', date: '2026-11-19', status: '처리 중', description: '팀별로 사용 중인 공용 저장소 용량을 확인해 주세요.' },
]

export const columns: UIDataTableColumn<Request>[] = [
  { accessorKey: 'id', header: '요청 번호' },
  { accessorKey: 'title', header: '요청 제목' },
  { accessorKey: 'team', header: '담당 팀' },
  { accessorKey: 'status', header: '상태' },
  { accessorKey: 'date', header: '접수일' },
]

export const initialActivity: UIListItem[] = [
  { key: '1048', title: '업무 포털 열람 권한 추가 접수', description: '11월 23일 10:20 · 플랫폼팀' },
  { key: '1047', title: '정기 보고서 발송 시간 변경 착수', description: '11월 23일 09:45 · 서비스운영팀' },
  { key: '1045', title: '파일 보관 정책 적용 완료', description: '11월 22일 16:10 · 플랫폼팀' },
]

export const periods = [
  { value: 'latest', label: '11.16–11.22', firstDay: 16, intake: [18, 24, 22, 32, 28, 14, 12], completed: [14, 18, 21, 25, 24, 11, 8] },
  { value: 'previous', label: '11.09–11.15', firstDay: 9, intake: [20, 18, 22, 26, 24, 9, 11], completed: [15, 13, 17, 20, 18, 7, 6] },
] as const
