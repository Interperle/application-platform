CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into user_profiles_table using NEW.id for the user ID
    INSERT INTO user_profiles_table (id, userrole)
    VALUES (NEW.id, 1);  -- Assuming '1' is the default role ID

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

