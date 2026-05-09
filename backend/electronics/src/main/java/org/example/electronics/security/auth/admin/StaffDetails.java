package org.example.electronics.security.auth.admin;

import lombok.NonNull;
import org.example.electronics.entity.StaffEntity;
import org.example.electronics.entity.enums.UserStatus;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public record StaffDetails(StaffEntity staffEntity) implements UserDetails {

    @Override
    @NonNull
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = staffEntity.getRole().getPermissions().stream()
                .map(permissionEntity -> new SimpleGrantedAuthority(permissionEntity.getName()))
                .collect(Collectors.toSet());

        authorities.add(new SimpleGrantedAuthority(staffEntity.getRole().getName()));

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
        return staffEntity.getStatus() == UserStatus.ACTIVE;
    }
}
