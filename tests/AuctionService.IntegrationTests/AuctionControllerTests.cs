﻿using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.IntegrationTests.Fixtures;
using AuctionService.IntegrationTests.Util;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;

namespace AuctionService.IntegrationTests
{
    public class AuctionControllerTests : IClassFixture<CustomWebAppFactory>, IAsyncLifetime
    {
        private readonly CustomWebAppFactory _factory;
        private readonly HttpClient _httpClient;
        private const string GT_ID = "afbee524-5972-4075-8800-7d1f9d7b0a0c";

        public AuctionControllerTests(CustomWebAppFactory factory)
        {
            _factory = factory;
            _httpClient = factory.CreateClient();
        }

        [Fact]
        public async Task GetAuctions_ShouldReturn3Actions()
        {
            var response = await _httpClient.GetFromJsonAsync<List<AuctionDto>>("api/auctions");

            Assert.Equal(3, response.Count);
        }

        [Fact]
        public async Task GetAuctionById_WithValidId_ShouldReturnAuction()
        {
            var response = await _httpClient.GetFromJsonAsync<AuctionDto>($"api/auctions/{GT_ID}");

            Assert.Equal("GT", response.Model);
        }

        [Fact]
        public async Task GetAuctionById_WithInvalidId_ShouldReturn404Response()
        {
            var response = await _httpClient.GetAsync($"api/auctions/{Guid.NewGuid()}");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task GetAuctionById_WithInvalidGuid_ShouldReturnBadResponse()
        {
            var response = await _httpClient.GetAsync("api/auctions/not-a-guid");

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CreateAuction_WithNoAuth_ShouldReturnNotAuthorized()
        {
            var auction = new CreateAuctionDto { Make = "test" };

            var response = await _httpClient.PostAsJsonAsync("api/auctions", auction);

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task CreateAuction_WithAuth_ShouldReturn201()
        {
            var auction = GetAuctionForCreate();

            _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));

            var response = await _httpClient.PostAsJsonAsync("api/auctions", auction);

            response.EnsureSuccessStatusCode();

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            var createdAuction = await response.Content.ReadFromJsonAsync<AuctionDto>();

            Assert.Equal("bob", createdAuction.Seller);
        }

        [Fact]
        public async Task CreateAuction_WithInvalidCreateAuctionDto_ShouldReturn400()
        {
            var auction = GetAuctionForCreate();
            auction.Make = null;

            _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));

            var response = await _httpClient.PostAsJsonAsync("api/auctions", auction);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task UpdateAuction_WithValidUpdateDtoAndUser_ShouldReturn200()
        {
            var updateAuction = new UpdateAuctionDto() { Make = "Updated" };

            _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));

            var response = await _httpClient.PutAsJsonAsync($"api/auctions/{GT_ID}", updateAuction);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task UpdateAuction_WithValidUpdateDtoAndInvalidUser_ShouldReturn403()
        {
            var updateAuction = new UpdateAuctionDto() { Make = "Updated" };

            _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("notbob"));

            var response = await _httpClient.PutAsJsonAsync($"api/auctions/{GT_ID}", updateAuction);

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }

        public Task InitializeAsync() => Task.CompletedTask;


        public Task DisposeAsync()
        {
            using var scope = _factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AuctionDbContext>();

            DbHelper.ReinitDbForTests(db);

            return Task.CompletedTask;
        }

        private CreateAuctionDto GetAuctionForCreate()
        {
            return new CreateAuctionDto
            {
                Make = "test",
                Model = "testModel",
                ImageUrl = "test",
                Color = "test",
                Mileage = 10,
                Year = 10,
                ReservePrice = 10
            };
        }
    }
}
