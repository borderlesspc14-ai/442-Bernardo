import type {
  User,
  Unit,
  Resident,
  Visitor,
  Occurrence,
  Charge,
  Announcement,
  AuditLog,
  DoormanEvent,
  Employee,
  Payment,
  Delivery,
} from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Carlos Silva",
    email: "admin@condominio.com",
    role: "admin",
    avatar: "",
    phone: "(11) 99999-0001",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "portaria@condominio.com",
    role: "employee",
    phone: "(11) 99999-0002",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    name: "João Oliveira",
    email: "joao@email.com",
    role: "resident",
    unitId: "unit-1",
    phone: "(11) 99999-0003",
    createdAt: "2024-02-01T00:00:00Z",
  },
]

export const mockUnits: Unit[] = [
  { id: "unit-1", block: "A", number: "101", floor: 1, type: "apartment", status: "occupied", residents: ["res-1"] },
  { id: "unit-2", block: "A", number: "102", floor: 1, type: "apartment", status: "occupied", residents: ["res-2"] },
  { id: "unit-3", block: "A", number: "201", floor: 2, type: "apartment", status: "vacant", residents: [] },
  { id: "unit-4", block: "A", number: "202", floor: 2, type: "apartment", status: "occupied", residents: ["res-3"] },
  { id: "unit-5", block: "B", number: "101", floor: 1, type: "apartment", status: "occupied", residents: ["res-4", "res-5"] },
  { id: "unit-6", block: "B", number: "102", floor: 1, type: "apartment", status: "vacant", residents: [] },
  { id: "unit-7", block: "B", number: "201", floor: 2, type: "apartment", status: "occupied", residents: ["res-6"] },
  { id: "unit-8", block: "B", number: "202", floor: 2, type: "apartment", status: "occupied", residents: ["res-7"] },
]

export const mockResidents: Resident[] = [
  { id: "res-1", name: "João Oliveira", email: "joao@email.com", phone: "(11) 99999-1001", cpf: "123.456.789-00", unitId: "unit-1", isOwner: true, isActive: true, createdAt: "2024-02-01T00:00:00Z" },
  { id: "res-2", name: "Ana Costa", email: "ana@email.com", phone: "(11) 99999-1002", cpf: "234.567.890-11", unitId: "unit-2", isOwner: true, isActive: true, createdAt: "2024-02-05T00:00:00Z" },
  { id: "res-3", name: "Pedro Lima", email: "pedro@email.com", phone: "(11) 99999-1003", cpf: "345.678.901-22", unitId: "unit-4", isOwner: false, isActive: true, createdAt: "2024-02-10T00:00:00Z" },
  { id: "res-4", name: "Carla Souza", email: "carla@email.com", phone: "(11) 99999-1004", cpf: "456.789.012-33", unitId: "unit-5", isOwner: true, isActive: true, createdAt: "2024-02-15T00:00:00Z" },
  { id: "res-5", name: "Roberto Souza", email: "roberto@email.com", phone: "(11) 99999-1005", cpf: "567.890.123-44", unitId: "unit-5", isOwner: false, isActive: true, createdAt: "2024-02-15T00:00:00Z" },
  { id: "res-6", name: "Fernanda Alves", email: "fernanda@email.com", phone: "(11) 99999-1006", cpf: "678.901.234-55", unitId: "unit-7", isOwner: true, isActive: true, createdAt: "2024-03-01T00:00:00Z" },
  { id: "res-7", name: "Lucas Ferreira", email: "lucas@email.com", phone: "(11) 99999-1007", cpf: "789.012.345-66", unitId: "unit-8", isOwner: true, isActive: true, createdAt: "2024-03-05T00:00:00Z" },
]

export const mockVisitors: Visitor[] = [
  { id: "vis-1", name: "Paulo Mendes", document: "111.222.333-44", phone: "(11) 98888-0001", unitId: "unit-1", unitNumber: "101", purpose: "Visita familiar", preRegistered: true, status: "inside", entryTime: "2025-01-30T09:00:00Z", validatedAt: "2025-01-30T09:00:00Z", validatedBy: "2", createdAt: "2025-01-29T18:00:00Z" },
  { id: "vis-2", name: "Lucia Rodrigues", document: "222.333.444-55", unitId: "unit-2", unitNumber: "102", purpose: "Entrega de encomenda", preRegistered: false, status: "expected", entryTime: "2025-01-30T10:00:00Z", createdAt: "2025-01-30T10:00:00Z" },
  { id: "vis-3", name: "Marcos Pereira", document: "333.444.555-66", phone: "(11) 98888-0003", unitId: "unit-5", unitNumber: "101-B", purpose: "Manutencao", vehiclePlate: "ABC-1234", preRegistered: true, status: "inside", entryTime: "2025-01-30T08:30:00Z", validatedAt: "2025-01-30T08:25:00Z", validatedBy: "2", createdAt: "2025-01-29T20:00:00Z" },
  { id: "vis-4", name: "Sandra Lima", document: "444.555.666-77", unitId: "unit-4", unitNumber: "202", purpose: "Visita social", preRegistered: true, status: "left", entryTime: "2025-01-29T14:00:00Z", exitTime: "2025-01-29T18:00:00Z", validatedAt: "2025-01-29T13:55:00Z", validatedBy: "2", createdAt: "2025-01-28T10:00:00Z" },
  { id: "vis-5", name: "Ricardo Martins", document: "555.666.777-88", phone: "(11) 98888-0005", unitId: "unit-7", unitNumber: "201-B", purpose: "Reuniao de negocios", preRegistered: true, status: "expected", entryTime: "2025-01-30T14:00:00Z", createdAt: "2025-01-30T08:00:00Z" },
]

export const mockOccurrences: Occurrence[] = [
  { id: "occ-1", title: "Barulho excessivo", description: "Barulho alto apos as 22h na unidade 202 Bloco A. O som estava muito alto e incomodou varios moradores.", type: "complaint", priority: "medium", status: "open", reportedBy: "res-1", location: "Bloco A - 202", unitId: "unit-4", createdAt: "2025-01-29T23:30:00Z" },
  { id: "occ-2", title: "Vazamento na garagem", description: "Vazamento de agua no teto da garagem G2, proximo a vaga 15. A agua esta escorrendo constantemente.", type: "maintenance", priority: "high", status: "in_progress", reportedBy: "res-2", location: "Garagem G2", createdAt: "2025-01-28T10:00:00Z" },
  { id: "occ-3", title: "Porta do hall travada", description: "A porta do hall do Bloco B esta com dificuldade para abrir. O mecanismo parece estar danificado.", type: "maintenance", priority: "medium", status: "resolved", reportedBy: "res-6", location: "Hall Bloco B", resolution: "Mecanismo da porta substituido pela equipe de manutencao.", createdAt: "2025-01-25T15:00:00Z", resolvedAt: "2025-01-26T11:00:00Z" },
  { id: "occ-4", title: "Pessoa suspeita", description: "Pessoa desconhecida circulando pelo estacionamento em horario noturno. Verificar cameras.", type: "security", priority: "high", status: "closed", reportedBy: "2", location: "Estacionamento", resolution: "Verificado nas cameras. Era um prestador de servico que entrou pelo portao de servico.", createdAt: "2025-01-20T21:00:00Z", resolvedAt: "2025-01-20T21:30:00Z" },
  { id: "occ-5", title: "Elevador com problema", description: "Elevador do Bloco A fazendo barulho estranho ao parar nos andares.", type: "maintenance", priority: "high", status: "open", reportedBy: "res-4", location: "Elevador Bloco A", createdAt: "2025-01-30T07:00:00Z" },
]

export const mockCharges: Charge[] = [
  { id: "chg-1", unitId: "unit-1", residentId: "res-1", description: "Taxa condominial - Janeiro/2025", amount: 850.0, dueDate: "2025-01-10", status: "paid", paidAt: "2025-01-08T14:30:00Z", createdAt: "2025-01-01T00:00:00Z" },
  { id: "chg-2", unitId: "unit-1", residentId: "res-1", description: "Taxa condominial - Fevereiro/2025", amount: 850.0, dueDate: "2025-02-10", status: "pending", boletoCode: "23793.38128 60000.000003 00000.000400 1 84340000085000", createdAt: "2025-02-01T00:00:00Z" },
  { id: "chg-3", unitId: "unit-2", residentId: "res-2", description: "Taxa condominial - Janeiro/2025", amount: 850.0, dueDate: "2025-01-10", status: "overdue", createdAt: "2025-01-01T00:00:00Z" },
  { id: "chg-4", unitId: "unit-4", residentId: "res-3", description: "Taxa condominial - Janeiro/2025", amount: 850.0, dueDate: "2025-01-10", status: "paid", paidAt: "2025-01-09T10:00:00Z", createdAt: "2025-01-01T00:00:00Z" },
  { id: "chg-5", unitId: "unit-5", residentId: "res-4", description: "Taxa condominial - Janeiro/2025", amount: 850.0, dueDate: "2025-01-10", status: "paid", paidAt: "2025-01-07T16:00:00Z", createdAt: "2025-01-01T00:00:00Z" },
  { id: "chg-6", unitId: "unit-7", residentId: "res-6", description: "Taxa condominial - Janeiro/2025", amount: 850.0, dueDate: "2025-01-10", status: "overdue", createdAt: "2025-01-01T00:00:00Z" },
  { id: "chg-7", unitId: "unit-8", residentId: "res-7", description: "Taxa condominial - Janeiro/2025", amount: 850.0, dueDate: "2025-01-10", status: "pending", paymentLink: "https://pay.example.com/chg-7", createdAt: "2025-01-01T00:00:00Z" },
]

export const mockAnnouncements: Announcement[] = [
  { id: "ann-1", title: "Manutenção do elevador", content: "O elevador do Bloco A passará por manutenção preventiva no dia 05/02 das 8h às 12h. Pedimos desculpas pelo transtorno.", type: "maintenance", priority: "high", authorId: "1", isActive: true, expiresAt: "2025-02-06T00:00:00Z", createdAt: "2025-01-28T10:00:00Z" },
  { id: "ann-2", title: "Assembleia Geral", content: "Convocamos todos os moradores para a Assembleia Geral Ordinária que será realizada no dia 15/02 às 19h no salão de festas.", type: "event", priority: "medium", authorId: "1", isActive: true, expiresAt: "2025-02-16T00:00:00Z", createdAt: "2025-01-25T14:00:00Z" },
  { id: "ann-3", title: "Horário da piscina", content: "Informamos que o horário de funcionamento da piscina foi alterado para 7h às 21h durante o verão.", type: "general", priority: "low", authorId: "1", isActive: true, createdAt: "2025-01-20T09:00:00Z" },
]

export const mockAuditLogs: AuditLog[] = [
  { id: "log-1", userId: "1", userName: "Carlos Silva", userRole: "admin", action: "create", module: "announcements", description: "Criou comunicado: Manutencao do elevador", ipAddress: "192.168.1.100", timestamp: "2025-01-28T10:00:00Z" },
  { id: "log-2", userId: "2", userName: "Maria Santos", userRole: "employee", action: "update", module: "visitors", description: "Validou visitante: Paulo Mendes para unidade 101-A", ipAddress: "192.168.1.101", timestamp: "2025-01-30T09:00:00Z" },
  { id: "log-3", userId: "1", userName: "Carlos Silva", userRole: "admin", action: "update", module: "financial", description: "Atualizou status de cobranca para PAGO", ipAddress: "192.168.1.100", timestamp: "2025-01-08T14:30:00Z" },
  { id: "log-4", userId: "2", userName: "Maria Santos", userRole: "employee", action: "create", module: "occurrences", description: "Registrou ocorrencia: Pessoa suspeita", ipAddress: "192.168.1.101", timestamp: "2025-01-20T21:00:00Z" },
  { id: "log-5", userId: "1", userName: "Carlos Silva", userRole: "admin", action: "delete", module: "residents", description: "Removeu morador inativo: Antonio Gomes", ipAddress: "192.168.1.100", timestamp: "2025-01-15T16:00:00Z" },
  { id: "log-6", userId: "3", userName: "Joao Oliveira", userRole: "resident", action: "login", module: "auth", description: "Login realizado com sucesso", ipAddress: "187.45.32.100", timestamp: "2025-01-30T08:00:00Z" },
  { id: "log-7", userId: "1", userName: "Carlos Silva", userRole: "admin", action: "create", module: "units", description: "Criou nova unidade: 301 Bloco C", ipAddress: "192.168.1.100", timestamp: "2025-01-29T14:00:00Z" },
  { id: "log-8", userId: "2", userName: "Maria Santos", userRole: "employee", action: "update", module: "security", description: "Registrou entrada de visitante", ipAddress: "192.168.1.101", timestamp: "2025-01-30T09:05:00Z" },
]

export const mockDoormanEvents: DoormanEvent[] = [
  { id: "evt-1", type: "visitor", description: "Visitante Paulo Mendes entrou - Unidade 101-A", visitorId: "vis-1", unitId: "unit-1", registeredBy: "2", createdAt: "2025-01-30T09:05:00Z" },
  { id: "evt-2", type: "entry", description: "Morador João Oliveira entrou pelo portão principal", unitId: "unit-1", registeredBy: "2", createdAt: "2025-01-30T08:45:00Z" },
  { id: "evt-3", type: "delivery", description: "Entrega recebida para Unidade 202-A - Mercado Livre", unitId: "unit-4", registeredBy: "2", createdAt: "2025-01-30T08:30:00Z" },
  { id: "evt-4", type: "visitor", description: "Prestador Marcos Pereira entrou - Manutenção Unidade 101-B", visitorId: "vis-3", unitId: "unit-5", registeredBy: "2", createdAt: "2025-01-30T08:30:00Z" },
  { id: "evt-5", type: "exit", description: "Visitante Sandra Lima saiu - Unidade 202-A", visitorId: "vis-4", unitId: "unit-4", registeredBy: "2", createdAt: "2025-01-29T18:00:00Z" },
  { id: "evt-6", type: "occurrence", description: "Ocorrência registrada: Pessoa suspeita no estacionamento", registeredBy: "2", createdAt: "2025-01-20T21:00:00Z" },
]

export const mockEmployees: Employee[] = [
  { id: "emp-1", name: "Maria Santos", email: "maria@condominio.com", phone: "(11) 99999-2001", cpf: "111.222.333-01", role: "doorman", shift: "morning", isActive: true, hireDate: "2023-06-15", createdAt: "2023-06-15T00:00:00Z" },
  { id: "emp-2", name: "Jose Ferreira", email: "jose@condominio.com", phone: "(11) 99999-2002", cpf: "222.333.444-02", role: "doorman", shift: "afternoon", isActive: true, hireDate: "2023-08-01", createdAt: "2023-08-01T00:00:00Z" },
  { id: "emp-3", name: "Antonio Souza", email: "antonio@condominio.com", phone: "(11) 99999-2003", cpf: "333.444.555-03", role: "doorman", shift: "night", isActive: true, hireDate: "2024-01-10", createdAt: "2024-01-10T00:00:00Z" },
  { id: "emp-4", name: "Rosa Oliveira", email: "rosa@condominio.com", phone: "(11) 99999-2004", cpf: "444.555.666-04", role: "cleaner", shift: "morning", isActive: true, hireDate: "2023-03-20", createdAt: "2023-03-20T00:00:00Z" },
  { id: "emp-5", name: "Pedro Almeida", email: "pedro@condominio.com", phone: "(11) 99999-2005", cpf: "555.666.777-05", role: "maintenance", isActive: true, hireDate: "2022-11-01", createdAt: "2022-11-01T00:00:00Z" },
  { id: "emp-6", name: "Jorge Lima", email: "jorge@condominio.com", phone: "(11) 99999-2006", cpf: "666.777.888-06", role: "security", shift: "night", isActive: false, hireDate: "2022-05-15", createdAt: "2022-05-15T00:00:00Z" },
]

export const mockPayments: Payment[] = [
  { id: "pay-1", unitId: "unit-1", unitNumber: "101", type: "condominium", amount: 850, dueDate: "2025-01-10", status: "paid", paidAt: "2025-01-08T14:30:00Z", description: "Taxa condominial - Janeiro/2025", createdAt: "2025-01-01T00:00:00Z" },
  { id: "pay-2", unitId: "unit-1", unitNumber: "101", type: "condominium", amount: 850, dueDate: "2025-02-10", status: "pending", description: "Taxa condominial - Fevereiro/2025", createdAt: "2025-02-01T00:00:00Z" },
  { id: "pay-3", unitId: "unit-2", unitNumber: "102", type: "condominium", amount: 850, dueDate: "2025-01-10", status: "overdue", description: "Taxa condominial - Janeiro/2025", createdAt: "2025-01-01T00:00:00Z" },
  { id: "pay-4", unitId: "unit-4", unitNumber: "202", type: "condominium", amount: 850, dueDate: "2025-01-10", status: "paid", paidAt: "2025-01-09T10:00:00Z", description: "Taxa condominial - Janeiro/2025", createdAt: "2025-01-01T00:00:00Z" },
  { id: "pay-5", unitId: "unit-5", unitNumber: "101-B", type: "condominium", amount: 850, dueDate: "2025-01-10", status: "paid", paidAt: "2025-01-07T16:00:00Z", description: "Taxa condominial - Janeiro/2025", createdAt: "2025-01-01T00:00:00Z" },
  { id: "pay-6", unitId: "unit-7", unitNumber: "201-B", type: "condominium", amount: 850, dueDate: "2025-01-10", status: "overdue", description: "Taxa condominial - Janeiro/2025", createdAt: "2025-01-01T00:00:00Z" },
  { id: "pay-7", unitId: "unit-1", unitNumber: "101", type: "extra", amount: 150, dueDate: "2025-01-15", status: "paid", paidAt: "2025-01-14T11:00:00Z", description: "Taxa extra - Pintura fachada", createdAt: "2025-01-05T00:00:00Z" },
  { id: "pay-8", unitId: "unit-4", unitNumber: "202", type: "fine", amount: 200, dueDate: "2025-01-20", status: "pending", description: "Multa - Barulho excessivo", createdAt: "2025-01-10T00:00:00Z" },
]

export const mockDeliveries: Delivery[] = [
  { id: "del-1", unitId: "unit-1", unitNumber: "101", receivedAt: "2025-01-30T08:30:00Z", receivedBy: "Maria Santos", carrier: "Correios", trackingCode: "BR123456789BR", description: "Caixa pequena", status: "pending" },
  { id: "del-2", unitId: "unit-4", unitNumber: "202", receivedAt: "2025-01-30T09:15:00Z", receivedBy: "Maria Santos", carrier: "Mercado Livre", description: "Pacote medio", status: "pending" },
  { id: "del-3", unitId: "unit-5", unitNumber: "101-B", receivedAt: "2025-01-29T14:00:00Z", receivedBy: "Jose Ferreira", carrier: "Amazon", trackingCode: "AMZ987654321", description: "Caixa grande", status: "picked_up", pickedUpAt: "2025-01-29T18:30:00Z", pickedUpBy: "Carla Souza" },
  { id: "del-4", unitId: "unit-2", unitNumber: "102", receivedAt: "2025-01-30T10:00:00Z", receivedBy: "Maria Santos", carrier: "Sedex", trackingCode: "SX111222333BR", status: "pending" },
  { id: "del-5", unitId: "unit-7", unitNumber: "201-B", receivedAt: "2025-01-28T11:30:00Z", receivedBy: "Jose Ferreira", carrier: "Jadlog", description: "Envelope", status: "picked_up", pickedUpAt: "2025-01-28T19:00:00Z", pickedUpBy: "Fernanda Alves" },
]

export function getUnitDisplay(unit: Unit): string {
  return `${unit.number} - Bloco ${unit.block}`
}

export function getResidentByUnit(unitId: string): Resident[] {
  return mockResidents.filter((r) => r.unitId === unitId)
}

export function getUnitById(unitId: string): Unit | undefined {
  return mockUnits.find((u) => u.id === unitId)
}

export function getChargesByUnit(unitId: string): Charge[] {
  return mockCharges.filter((c) => c.unitId === unitId)
}

export function getChargesByResident(residentId: string): Charge[] {
  return mockCharges.filter((c) => c.residentId === residentId)
}
