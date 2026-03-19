package com.app.globalgates.mapper;

import com.app.globalgates.dto.AdvertisementDTO;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@SpringBootTest
@Slf4j
public class AdvertisementMapperTests {
    @Autowired
    private AdvertisementMapper advertisementMapper;

    @Test
    public void insertTest() {
        AdvertisementDTO adDTO = new AdvertisementDTO();

        adDTO.setAdvertiserId(1L);
        adDTO.setTitle("친환경 담요 OEM 상담");
        adDTO.setHeadline("해외 바이어 맞춤 생산 가능");
        adDTO.setDescription("소량 MOQ부터 대량 생산까지 대응하며 샘플 발송과 맞춤 라벨링이 가능합니다. 해외 바이어 문의에 빠르게 응답합니다.");
        adDTO.setLandingUrl("https://globalgates.com/store/yunchan");
        adDTO.setBudget(300000);
        adDTO.setImpressionEstimate(1500);
        adDTO.setStartedAt(String.valueOf(LocalDate.now()));

        advertisementMapper.insert(adDTO);

        log.info("등록된 광고 정보 : {}", adDTO);
    }

    @Test
    public void testSelectAll() {
        List<AdvertisementDTO> foundAds = advertisementMapper.selectAll();

        log.info("받아온 광고들 : {}", foundAds);
    }

}
