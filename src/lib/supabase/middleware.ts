import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, type NextResponse } from 'next/server';

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let response = new Response(request.body, {
    headers: request.headers,
    status: request.status,
    statusText: request.statusText,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = new Response(request.body, {
            headers: request.headers,
            status: request.status,
            statusText: request.statusText,
          });
          response.headers.set(
            'Set-Cookie',
            `${name}=${value}; ${options.path ? `Path=${options.path};` : ''} ${
              options.maxAge ? `Max-Age=${options.maxAge};` : ''
            } ${options.httpOnly ? 'HttpOnly;' : ''} ${
              options.secure ? 'Secure;' : ''
            } SameSite=Lax`
          );
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = new Response(request.body, {
            headers: request.headers,
            status: request.status,
            statusText: request.statusText,
          });
          response.headers.set(
            'Set-Cookie',
            `${name}=; Path=${options.path}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
          );
        },
      },
    }
  );

  return { supabase, response: response as NextResponse };
};
