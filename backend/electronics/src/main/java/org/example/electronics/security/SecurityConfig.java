package org.example.electronics.security;

import lombok.RequiredArgsConstructor;
import org.example.electronics.monitoring.MonitoringLogger;
import org.example.electronics.security.auth.admin.StaffDetailsService;
import org.example.electronics.security.jwt.JwtAccessDeniedHandler;
import org.example.electronics.security.jwt.JwtAuthEntryPoint;
import org.example.electronics.security.jwt.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final StaffDetailsService staffDetailsService;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origin-patterns:http://localhost:*,http://127.0.0.1:*}")
    private String allowedOriginPatterns;

    private static final String ROLE_ADMIN = "ROLE_ADMIN";
    private static final String ROLE_STAFF = "ROLE_STAFF";
    private static final String[] ADMIN_ONLY_ENDPOINTS = {
            "/api/admin/users",
            "/api/admin/users/**",
            "/api/admin/staffs",
            "/api/admin/staffs/**",
            "/api/admin/roles",
            "/api/admin/roles/**",
            "/api/admin/permissions",
            "/api/admin/permissions/**"
    };
    private static final String[] CATEGORY_ENDPOINTS = {"/api/admin/categories", "/api/admin/categories/**"};
    private static final String[] BRAND_ENDPOINTS = {"/api/admin/brands", "/api/admin/brands/**"};
    private static final String[] PRODUCT_ENDPOINTS = {"/api/admin/products", "/api/admin/products/**"};
    private static final String[] PUBLIC_PRODUCT_ENDPOINTS = {"/api/products", "/api/products/**"};
    private static final String[] VARIANT_ENDPOINTS = {"/api/admin/variants", "/api/admin/variants/**"};
    private static final String[] MEDIA_ENDPOINTS = {"/api/admin/media", "/api/admin/media/**"};
    private static final String[] ORDER_ENDPOINTS = {"/api/admin/orders", "/api/admin/orders/**"};
    private static final String[] PAYMENT_ENDPOINTS = {"/api/admin/payments", "/api/admin/payments/**"};
    private static final String[] REPORT_ENDPOINTS = {"/api/admin/reports", "/api/admin/reports/**"};
    private static final String[] RETURN_ENDPOINTS = {"/api/admin/return-requests", "/api/admin/return-requests/**"};
    private static final String[] COUPON_ENDPOINTS = {"/api/admin/coupons", "/api/admin/coupons/**"};
    private static final String[] WAREHOUSE_ENDPOINTS = {
            "/api/admin/warehouses",
            "/api/admin/warehouses/**",
            "/api/admin/warehouse-transactions",
            "/api/admin/warehouse-transactions/**"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider(staffDetailsService);

        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder);

        return daoAuthenticationProvider;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity, DaoAuthenticationProvider daoAuthenticationProvider) {
        httpSecurity
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
        .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler)
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/health", "/api/health/**").permitAll()
                        .requestMatchers("/api/admin/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.GET, PUBLIC_PRODUCT_ENDPOINTS).permitAll()
                        .requestMatchers("/api/system/payment/vnpay-ipn", "/api/system/payment/momo-ipn").permitAll()
                        .requestMatchers("/api/payments/vnpay-return", "/api/payments/momo-return").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/api/auth/logout").hasAnyAuthority("ROLE_USER", "ROLE_CUSTOMER")
                        .requestMatchers("/api/cart", "/api/cart/**").hasAnyAuthority("ROLE_USER", "ROLE_CUSTOMER")
                        .requestMatchers("/api/admin/auth/logout").hasAnyAuthority(ROLE_ADMIN, ROLE_STAFF)
                        .requestMatchers(ADMIN_ONLY_ENDPOINTS).hasAuthority(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.GET, CATEGORY_ENDPOINTS).hasAnyAuthority(adminOrPermission("category:view"))
                        .requestMatchers(HttpMethod.POST, CATEGORY_ENDPOINTS).hasAnyAuthority(adminOrPermission("category:create"))
                        .requestMatchers(HttpMethod.PUT, CATEGORY_ENDPOINTS).hasAnyAuthority(adminOrPermission("category:update"))
                        .requestMatchers(HttpMethod.PATCH, CATEGORY_ENDPOINTS).hasAnyAuthority(adminOrPermission("category:update"))
                        .requestMatchers(HttpMethod.DELETE, CATEGORY_ENDPOINTS).hasAnyAuthority(adminOrPermission("category:delete"))
                        .requestMatchers(HttpMethod.GET, BRAND_ENDPOINTS).hasAnyAuthority(adminOrPermission("brand:view"))
                        .requestMatchers(HttpMethod.POST, BRAND_ENDPOINTS).hasAnyAuthority(adminOrPermission("brand:create"))
                        .requestMatchers(HttpMethod.PUT, BRAND_ENDPOINTS).hasAnyAuthority(adminOrPermission("brand:update"))
                        .requestMatchers(HttpMethod.PATCH, BRAND_ENDPOINTS).hasAnyAuthority(adminOrPermission("brand:update"))
                        .requestMatchers(HttpMethod.DELETE, BRAND_ENDPOINTS).hasAnyAuthority(adminOrPermission("brand:delete"))
                        .requestMatchers(HttpMethod.GET, PRODUCT_ENDPOINTS).hasAnyAuthority(adminOrPermission("product:view"))
                        .requestMatchers(HttpMethod.POST, PRODUCT_ENDPOINTS).hasAnyAuthority(adminOrPermission("product:create"))
                        .requestMatchers(HttpMethod.PUT, PRODUCT_ENDPOINTS).hasAnyAuthority(adminOrPermission("product:update"))
                        .requestMatchers(HttpMethod.PATCH, PRODUCT_ENDPOINTS).hasAnyAuthority(adminOrPermission("product:update"))
                        .requestMatchers(HttpMethod.DELETE, PRODUCT_ENDPOINTS).hasAnyAuthority(adminOrPermission("product:delete"))
                        .requestMatchers(HttpMethod.GET, VARIANT_ENDPOINTS).hasAnyAuthority(adminOrPermission("variant:view"))
                        .requestMatchers(HttpMethod.POST, VARIANT_ENDPOINTS).hasAnyAuthority(adminOrPermission("variant:create"))
                        .requestMatchers(HttpMethod.PUT, VARIANT_ENDPOINTS).hasAnyAuthority(adminOrPermission("variant:update"))
                        .requestMatchers(HttpMethod.PATCH, VARIANT_ENDPOINTS).hasAnyAuthority(adminOrPermission("variant:update"))
                        .requestMatchers(HttpMethod.DELETE, VARIANT_ENDPOINTS).hasAnyAuthority(adminOrPermission("variant:delete"))
                        .requestMatchers(HttpMethod.GET, MEDIA_ENDPOINTS).hasAnyAuthority(adminOrPermission("media:view"))
                        .requestMatchers(HttpMethod.POST, MEDIA_ENDPOINTS).hasAnyAuthority(adminOrPermission("media:create"))
                        .requestMatchers(HttpMethod.PATCH, MEDIA_ENDPOINTS).hasAnyAuthority(adminOrPermission("media:update"))
                        .requestMatchers(HttpMethod.DELETE, MEDIA_ENDPOINTS).hasAnyAuthority(adminOrPermission("media:delete"))
                        .requestMatchers(HttpMethod.GET, ORDER_ENDPOINTS).hasAnyAuthority(adminOrPermission("order:view"))
                        .requestMatchers(HttpMethod.PATCH, ORDER_ENDPOINTS).hasAnyAuthority(adminOrPermission("order:update"))
                        .requestMatchers(HttpMethod.GET, PAYMENT_ENDPOINTS).hasAnyAuthority(adminOrPermission("payment:view", "order:view"))
                        .requestMatchers(HttpMethod.GET, REPORT_ENDPOINTS)
                        .hasAnyAuthority(adminOrPermission("dashboard:view", "revenue-report:view", "best-seller-report:view", "order:view"))
                        .requestMatchers(HttpMethod.GET, RETURN_ENDPOINTS).hasAnyAuthority(adminOrPermission("return-request:view", "order:view"))
                        .requestMatchers(HttpMethod.PATCH, RETURN_ENDPOINTS).hasAnyAuthority(adminOrPermission("return-request:update", "order:update"))
                        .requestMatchers(HttpMethod.GET, COUPON_ENDPOINTS).hasAnyAuthority(adminOrPermission("coupon:view"))
                        .requestMatchers(HttpMethod.POST, COUPON_ENDPOINTS).hasAnyAuthority(adminOrPermission("coupon:create"))
                        .requestMatchers(HttpMethod.PUT, COUPON_ENDPOINTS).hasAnyAuthority(adminOrPermission("coupon:update"))
                        .requestMatchers(HttpMethod.PATCH, COUPON_ENDPOINTS).hasAnyAuthority(adminOrPermission("coupon:update"))
                        .requestMatchers(HttpMethod.DELETE, COUPON_ENDPOINTS).hasAnyAuthority(adminOrPermission("coupon:delete"))
                        .requestMatchers(HttpMethod.GET, WAREHOUSE_ENDPOINTS).hasAnyAuthority(adminOrPermission("warehouse:view"))
                        .requestMatchers(HttpMethod.POST, WAREHOUSE_ENDPOINTS).hasAnyAuthority(adminOrPermission("warehouse:create"))
                        .requestMatchers(HttpMethod.PUT, WAREHOUSE_ENDPOINTS).hasAnyAuthority(adminOrPermission("warehouse:update"))
                        .requestMatchers(HttpMethod.PATCH, WAREHOUSE_ENDPOINTS).hasAnyAuthority(adminOrPermission("warehouse:update"))
                        .requestMatchers(HttpMethod.DELETE, WAREHOUSE_ENDPOINTS).hasAnyAuthority(adminOrPermission("warehouse:delete"))
                        .requestMatchers("/api/admin/**").hasAuthority(ROLE_ADMIN)
                        .anyRequest().authenticated()
                );

        httpSecurity.authenticationProvider(daoAuthenticationProvider);

        httpSecurity.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(parseAllowedOriginPatterns());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization", MonitoringLogger.REQUEST_ID_HEADER));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    private String[] adminOrPermission(String... permissions) {
        String[] authorities = new String[permissions.length + 1];
        authorities[0] = ROLE_ADMIN;

        for (int index = 0; index < permissions.length; index++) {
            authorities[index + 1] = "PERM:" + normalizeAuthorityValue(permissions[index]);
        }

        return authorities;
    }

    private String normalizeAuthorityValue(String value) {
        if (value == null) {
            return "";
        }

        return value
                .trim()
                .toLowerCase(Locale.ROOT)
                .replaceAll("^permission[:_\\s-]+", "")
                .replaceAll("[._\\s-]+", ":")
                .replaceAll(":+", ":")
                .replaceAll("^:|:$", "");
    }

    private List<String> parseAllowedOriginPatterns() {
        List<String> patterns = Arrays.stream(allowedOriginPatterns.split(","))
                .map(String::trim)
                .filter(pattern -> !pattern.isBlank())
                .toList();

        if (patterns.isEmpty()) {
            return List.of("http://localhost:*", "http://127.0.0.1:*");
        }

        return patterns;
    }
}
