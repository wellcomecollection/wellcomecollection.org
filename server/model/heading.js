type Heading = {|
  level: number;
  value: any; // TODO: Make this not `any`
|}
export function createHeading(data: Heading) { return (data: Heading); }
