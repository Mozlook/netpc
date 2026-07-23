# --- Build stage: restore + publish with the .NET SDK ---
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Restore first (cached layer) using just the project file.
COPY ContactsApi.csproj ./
RUN dotnet restore

# Then copy the rest and publish a release build.
COPY . ./
RUN dotnet publish -c Release -o /app

# --- Runtime stage: smaller ASP.NET image, no SDK ---
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app ./

# Listen on 8080 (http only; TLS is terminated/handled outside the container).
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ContactsApi.dll"]
