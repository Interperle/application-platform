CREATE TRIGGER trigger_create_user_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_user_profile();