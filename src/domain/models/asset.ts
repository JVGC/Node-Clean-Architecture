import { User } from './user';


export interface Asset{
    id: string;
    name: string;
    description: string;
    model: string;
    owner: User;
    status: AssetsStatus;
    healthLevel: number
}

export enum AssetsStatus{
    running = "Running",
    alerting = "Alerting",
    stopped = "Stopped"
}