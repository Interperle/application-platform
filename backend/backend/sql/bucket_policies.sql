CREATE POLICY select_objects_for_owner ON storage.objects
    FOR SELECT USING (auth.uid() = owner);

CREATE POLICY insert_objects_for_owner ON storage.objects
    FOR INSERT WITH CHECK (auth.uid() = owner);

CREATE POLICY update_objects_for_owner ON storage.objects
    FOR UPDATE USING (auth.uid() = owner);

CREATE POLICY delete_objects_for_owner ON storage.objects
    FOR DELETE USING (auth.uid() = owner);

CREATE POLICY select_buckets_for_owner ON storage.buckets
    FOR SELECT USING (auth.uid() = owner);

CREATE POLICY insert_buckets_for_owner ON storage.buckets
    FOR INSERT WITH CHECK (auth.uid() = owner);

CREATE POLICY update_buckets_for_owner ON storage.buckets
    FOR UPDATE USING (auth.uid() = owner);

CREATE POLICY delete_buckets_for_owner ON storage.buckets
    FOR DELETE USING (auth.uid() = owner);
