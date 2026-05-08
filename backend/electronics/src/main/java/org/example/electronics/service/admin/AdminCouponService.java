package org.example.electronics.service.admin;

import org.example.electronics.dto.request.admin.AdminCouponRequestDTO;
import org.example.electronics.dto.request.admin.status.AdminUpdateCouponStatusRequestDTO;
import org.example.electronics.dto.response.admin.AdminCouponResponseDTO;
import org.example.electronics.entity.enums.CouponStatus;
import org.example.electronics.entity.enums.CouponTimeStatus;
import org.example.electronics.entity.enums.DateFilterType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminCouponService {

    AdminCouponResponseDTO createCoupon(AdminCouponRequestDTO adminCouponRequestDTO);
    AdminCouponResponseDTO updateCoupon(Integer couponId, AdminCouponRequestDTO adminCouponRequestDTO);
    AdminCouponResponseDTO updateStatusCoupon(Integer couponId, AdminUpdateCouponStatusRequestDTO adminUpdateCouponStatusRequestDTO);
    void deleteCoupon(Integer couponId);
    Page<AdminCouponResponseDTO> getAllCoupons(String keyword, CouponTimeStatus timeStatus, CouponStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    AdminCouponResponseDTO getCouponById(Integer couponId);
}
