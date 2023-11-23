.PHONY: lint pretty

lint:
	@echo "Running linters..."
	@npx eslint --ext .js,.jsx,.ts,.tsx --format stylish .

pretty:
	@echo "Fixing lint errors..."
	@npx eslint --ext .js,.jsx,.ts,.tsx --fix .
	@npx prettier --write .