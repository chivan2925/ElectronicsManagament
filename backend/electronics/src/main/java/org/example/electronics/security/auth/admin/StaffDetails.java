package org.example.electronics.security.auth.admin;

import lombok.NonNull;
import org.example.electronics.entity.StaffEntity;
import org.example.electronics.entity.enums.UserStatus;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public record StaffDetails(StaffEntity staffEntity) implements UserDetails {

    @Override
    @NonNull
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = staffEntity.getRole().getPermissions().stream()
                .flatMap(permissionEntity -> Stream.of(
                        permissionEntity.getName(),
                        permissionEntity.getCode(),
                        "PERM:" + normalizeAuthorityValue(permissionEntity.getName()),
                        "PERM:" + normalizeAuthorityValue(permissionEntity.getCode())
                ))
                .filter(value -> value != null && !value.isBlank())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        authorities.add(new SimpleGrantedAuthority(staffEntity.getRole().getName()));
        authorities.add(new SimpleGrantedAuthority("ROLE_STAFF"));

        if (isAdminRole(staffEntity.getRole().getName())) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }

        return authorities;
    }

    @NonNull
    public Integer getId() {
        return staffEntity.getId();
    }

    @Override
    @NonNull
    public String getUsername() {
        return staffEntity.getEmail();
    }

    @Override
    @Nullable
    public String getPassword() {
        return staffEntity.getHashedPassword();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return staffEntity.getStatus() != UserStatus.DELETED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return staffEntity.getStatus() == UserStatus.ACTIVE &&
                staffEntity.getRole() != null &&
                staffEntity.getRole().getStatus() == UserStatus.ACTIVE;
    }

    private boolean isAdminRole(String roleName) {
        String normalizedRole = normalizeAuthorityValue(roleName);

        return "admin".equals(normalizedRole) ||
                "administrator".equals(normalizedRole) ||
                "super:admin".equals(normalizedRole);
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
}
