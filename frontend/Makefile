.PHONY: lint pretty

lint:
	@echo "Running linters..."
	@npx eslint --ext .js,.jsx,.ts,.tsx --format stylish .

pretty:
	@echo "Fixing lint errors..."
	@npx eslint --ext .js,.jsx,.ts,.tsx --fix .
	@npx prettier --write .

	@echo "Counting remaining lint issues..."
	@npx eslint --ext .js,.jsx,.ts,.tsx . | tee /tmp/eslint-output
	@echo "Total ESLint issues remaining:"
	@grep -c '^\s*[0-9]*:' /tmp/eslint-output

	@echo "Code statistics:"
	@echo "Lines of code:"
	@find . -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' | xargs wc -l