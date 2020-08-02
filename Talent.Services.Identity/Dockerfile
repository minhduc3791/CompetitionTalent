FROM microsoft/dotnet:2.0.0-runtime
WORKDIR /dotnetapp
COPY ./.bin/Docker .
ENV ASPNETCORE_URLS http://*:8080
ENV ASPNETCORE_ENVIRONMENT docker
EXPOSE 8080
ENTRYPOINT dotnet Mars.Services.Identity.dll


