export interface MenuTree {
    path?: string;
    title?: string;
    icon?: string;
    type?: string;
    badgeType?: string;
    badgeValue?: string;
    active?: boolean;
    bookmark?: boolean;
    children?: MenuTree[];
}

export interface TreeNode {
    name: string;
    disabled?: boolean;
    checked?: boolean;
    children?: TreeNode[];
}

export interface FlatNode {
    expandable: boolean;
    name: string;
    level: number;
    disabled: boolean;
    checked: boolean;
}

export interface Actions {
    id: number;
    name: string;
    checked: boolean;
}
