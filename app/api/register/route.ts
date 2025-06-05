import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(req: Request) {

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return Response.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
    });

    if (error) {
        return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ user: data.user, session: data.session });
};
