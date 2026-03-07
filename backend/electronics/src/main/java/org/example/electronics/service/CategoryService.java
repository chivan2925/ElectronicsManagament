package org.example.electronics.service;

import org.example.electronics.dto.request.CategoryRequestDTO;
import org.example.electronics.dto.response.CategoryResponseDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface CategoryService {

    //Admin
    CategoryResponseDTO createCategory(CategoryRequestDTO categoryRequestDTO);
    CategoryResponseDTO updateCategory(Integer categoryId, CategoryRequestDTO categoryRequestDTO);
    void deleteCategory(Integer categoryId);
    Page<CategoryResponseDTO> getAllParentCategories(Pageable pageable);
    Page<CategoryResponseDTO> getAllSubCategories(Integer parentId, Pageable pageable);

    //End-user
    List<CategoryResponseDTO> getCategoryList();
    CategoryResponseDTO getCategoryById(Integer categoryId);
}
