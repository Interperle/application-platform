import os

from supabase import create_client


def init_supabase():
    # use SUPABASE_SERVICE_KEY to ignore Row Level Security
    return create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_KEY'))


def init_supabase_with_rls():
    # use SUPABASE_ANON_KEY to accept Row Level Security
    return create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_ANON_KEY'))