import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(req: Request) {
 
    const { email, password } = await req.json();

    if (!email || !password) {
        return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return Response.json({ error: error.message }, { status: 401 });
    }

    return Response.json({ user: data.user, session: data.session });
};

