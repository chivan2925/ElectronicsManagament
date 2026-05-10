package org.example.electronics.security.auth.user;

import lombok.NonNull;
import org.example.electronics.entity.UserEntity;
import org.example.electronics.entity.enums.UserStatus;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public record CustomerDetails(UserEntity userEntity) implements UserDetails {

    @Override
    @NonNull
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_USER"),
                new SimpleGrantedAuthority("ROLE_CUSTOMER"),
                new SimpleGrantedAuthority("USER"),
                new SimpleGrantedAuthority("CUSTOMER")
        );
    }

    @NonNull
    public Integer getId() {
        return userEntity.getId();
    }

    @Override
    @NonNull
    public String getUsername() {
        return userEntity.getEmail();
    }

    @Override
    @Nullable
    public String getPassword() {
        return userEntity.getHashedPassword();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return userEntity.getStatus() != UserStatus.DELETED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return userEntity.getStatus() == UserStatus.ACTIVE;
    }
}
