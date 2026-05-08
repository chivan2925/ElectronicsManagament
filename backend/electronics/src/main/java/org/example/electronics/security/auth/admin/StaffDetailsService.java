package org.example.electronics.security.auth.admin;

import org.jspecify.annotations.NonNull;
import org.example.electronics.entity.StaffEntity;
import org.example.electronics.repository.StaffRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class StaffDetailsService implements UserDetailsService {

    private final StaffRepository staffRepository;

    public StaffDetailsService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    @Override
    @NonNull
    public UserDetails loadUserByUsername(@NonNull String email) throws UsernameNotFoundException {
        StaffEntity staffEntity = staffRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Không tìm thấy nhân viên với email: " + email
                ));

        return new StaffDetails(staffEntity);
    }
}
