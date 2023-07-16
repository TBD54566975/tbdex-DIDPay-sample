.PHONY: image
image:
	@echo "Building production docker image"
	docker build \
		-f $(PWD)/dockerfiles/Dockerfile \
		-t didpay $(PWD)