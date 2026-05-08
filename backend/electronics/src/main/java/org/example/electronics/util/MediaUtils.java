package org.example.electronics.util;

import java.util.Set;

import org.example.electronics.entity.MediaEntity;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
public class MediaUtils {

    @Named("getPrimaryImage")
    public String getPrimaryImage(Set<MediaEntity> mediaEntitySet) {
        if (mediaEntitySet == null || mediaEntitySet.isEmpty()) {
            return null;
        }

        return mediaEntitySet.stream()
                .filter(media -> Boolean.TRUE.equals(media.getIsPrimary()))
                .map(MediaEntity::getImageUrl)
                .findFirst()
                .orElseGet(() -> mediaEntitySet.iterator().next().getImageUrl());
    }
}
