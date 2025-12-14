package com.fitflag.config;

import dev.openfeature.contrib.providers.flagd.FlagdOptions;
import dev.openfeature.contrib.providers.flagd.FlagdProvider;
import dev.openfeature.sdk.OpenFeatureAPI;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import io.quarkus.runtime.StartupEvent;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

@ApplicationScoped
public class OpenFeatureConfig {
    private static final Logger LOG = Logger.getLogger(OpenFeatureConfig.class);

    @ConfigProperty(name = "flagd.host", defaultValue = "localhost")
    String flagdHost;

    @ConfigProperty(name = "flagd.port", defaultValue = "8013")
    int flagdPort;

    @ConfigProperty(name = "flagd.tls", defaultValue = "false")
    boolean flagdTls;

    void onStart(@Observes StartupEvent ev) {
        LOG.info("Initializing OpenFeature with flagd provider");
        
        FlagdOptions options = FlagdOptions.builder()
                .host(flagdHost)
                .port(flagdPort)
                .tls(flagdTls)
                .build();

        FlagdProvider provider = new FlagdProvider(options);
        OpenFeatureAPI.getInstance().setProviderAndWait(provider);
        
        LOG.info("OpenFeature configured successfully with flagd at " + flagdHost + ":" + flagdPort);
    }
}
