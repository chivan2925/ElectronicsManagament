package org.example.electronics.service.admin;

import org.example.electronics.dto.request.admin.media.AdminUpdateMediaOrderRequestDTO;
import org.example.electronics.dto.request.admin.media.AdminAddMediaRequestDTO;
import org.example.electronics.dto.response.admin.AdminMediaResponseDTO;

public interface AdminMediaService {

    public AdminMediaResponseDTO addMedia(AdminAddMediaRequestDTO adminAddMediaRequestDTO);
    public void deleteMedia(Integer mediaId);
    public void setPrimaryMedia(Integer mediaId);
    AdminMediaResponseDTO updateMediaOrder(Integer mediaId, AdminUpdateMediaOrderRequestDTO adminUpdateMediaOrderRequestDTO);
}
