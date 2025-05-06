declare interface NextIdOptions {
  format?: 'numeric' | 'alphanumeric' | undefined;
}

declare interface InspectResult {
  id: string;
  alphanumericId: string;
  pseudoId: string;
  numericId: string;
  shardId: number;
  issuedAt: Date;
}

declare function generate(options?: NextIdOptions): string;

declare namespace generate {
  export function generate(options?: NextIdOptions): string;
  export function setShardId(shardId: number): typeof generate;
  export function inspect(id: string | bigint): InspectResult;
  export function isBrowser(): boolean;
  export function isNode(): boolean;
}

export = generate;
