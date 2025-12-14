package com.fitflag.resource;

import com.fitflag.model.DailySteps;
import com.fitflag.service.StepsService;
import dev.openfeature.sdk.Client;
import dev.openfeature.sdk.MutableContext;
import dev.openfeature.sdk.OpenFeatureAPI;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.jboss.logging.Logger;

@Path("/api/steps")
@Tag(name = "Steps", description = "Daily steps tracking API")
@Produces(MediaType.APPLICATION_JSON)
public class StepsResource {
    private static final Logger LOG = Logger.getLogger(StepsResource.class);

    @Inject
    StepsService stepsService;

    @GET
    @Path("/daily")
    @Operation(summary = "Get daily steps", description = "Returns daily steps calculated using the algorithm determined by feature flags")
    public DailySteps getDailySteps(
            @Parameter(description = "User ID for feature flag context") 
            @QueryParam("userId") @DefaultValue("user123") String userId,
            @Parameter(description = "User role for feature flag context") 
            @QueryParam("role") @DefaultValue("user") String role) {
        
        LOG.info("Fetching daily steps for user: " + userId + " with role: " + role);

        // Create OpenFeature evaluation context with user attributes and evaluate the feature flag
        MutableContext context = new MutableContext();
        context.add("userId", userId);
        context.add("role", role);
        Client client = OpenFeatureAPI.getInstance().getClient();
        String algorithm = client.getStringValue("step-calculation-algorithm", "simple", context);
        LOG.info("Using algorithm: " + algorithm + " for user " + userId);

        // Calculate steps based on the algorithm variant
        return switch (algorithm) {
            case "enhanced" -> stepsService.calculateWithEnhancedAlgorithm();
            case "ml-powered" -> stepsService.calculateWithMLAlgorithm();
            default -> stepsService.calculateWithSimpleAlgorithm();
        };
    }

    @GET
    @Path("/health")
    @Operation(summary = "Health check", description = "Simple health check endpoint")
    public String health() {
        return "{\"status\": \"healthy\"}";
    }
}
