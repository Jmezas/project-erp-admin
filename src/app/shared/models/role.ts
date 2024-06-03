export interface Role {
    id: number;
    name: string;
}

export interface RoleSave {
    id: number;
    name: string;
    menus: number[];
    actions: number[];
}
