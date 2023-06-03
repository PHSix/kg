export interface INode {
    id: string;
    label: string;
    color?: string;
    name?: string;
    type?: INodeType;
    imgUrl?: string;
    extra?: {
        [prop: string]: any;
    };
    [key: string]: any;
}
export interface ILink {
    id: string;
    label: string;
    target: string;
    source: string;
    color?: string;
    extra?: {
        [prop: string]: any;
    };
    [key: string]: any;
}

