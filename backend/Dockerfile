FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /App

# Copy everything
COPY . ./   

# Restore as distinct layers
RUN dotnet restore
# Build and publish a release
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /App
COPY --from=build-env /App/out .

ENV ASPNETCORE_hostBuilder__reloadConfigOnChange=false

ARG EMAIL_SMTP
ARG EMAIL_PORT
ARG EMAIL_ADDRESS
ARG EMAIL_PASSWORD

ENV EMAIL_SMTP=$EMAIL_SMTP
ENV EMAIL_PORT=$EMAIL_PORT
ENV EMAIL_ADDRESS=$EMAIL_ADDRESS
ENV EMAIL_PASSWORD=$EMAIL_PASSWORD

EXPOSE 5296

ENTRYPOINT ["dotnet", "QuizApp.dll"]