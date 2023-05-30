import { Unit } from './unit';
import { User } from './user';


// TODO: Adicionar image
export interface Asset{
    id: string;
    name: string;
    description: string;
    model: string; // DECISION: Não criar uma interface para o Model pois não há muitas informações deste nesse momento. Mas caso seja necessário seria bom criar e fazer um relation aqui
    owner: User; // DUVIDA: Esse Owner é um usuário do sistema?
    status: AssetsStatus; // DECISION: Default is RUNNING
    healthLevel: number // DECISION: Default is 100%
    unit: Unit
}

export enum AssetsStatus{
    running = "Running",
    alerting = "Alerting",
    stopped = "Stopped"
}