export interface ParsedResponse {
  ok: boolean;
  data: any;
  status: number;
  raw: Response;
}

export async function parseResponse(response: Response): Promise<ParsedResponse> {
  if (response.headers.get('content-type')?.includes('application/json')) {
    return {
      ok: response.ok,
      status: response.status,
      data: await response.json(),
      raw: response,
    };
  }

  return {
    ok: response.ok,
    status: response.status,
    data: {},
    raw: response,
  };
}
