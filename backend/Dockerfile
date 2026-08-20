# Stage 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["src/DeliveryTracker.Api/DeliveryTracker.Api.csproj", "src/DeliveryTracker.Api/"]
RUN dotnet restore "src/DeliveryTracker.Api/DeliveryTracker.Api.csproj"

# Copy source code and build app
COPY . .
WORKDIR "/src/src/DeliveryTracker.Api"
RUN dotnet publish "DeliveryTracker.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "DeliveryTracker.Api.dll"]
