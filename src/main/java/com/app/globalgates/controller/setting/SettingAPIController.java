package com.app.globalgates.controller.setting;

import com.app.globalgates.auth.CustomUserDetails;
import com.app.globalgates.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/settings/**")
@Slf4j
@RequiredArgsConstructor
public class SettingAPIController {

    private final MemberService memberService;

    // loginId를 프론트에서 받지 않고 인증 객체에서만 꺼내서 조회해서 유효성 검사를 한다.
    @GetMapping("check-password")
    public boolean checkPassword(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestParam String memberPassword) {
        return memberService.checkPassword(userDetails.getLoginId(),memberPassword);
    }

    @PostMapping("password")
    public ResponseEntity<?> updatePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> request
    ) {
        try {
            memberService.updatePassword(
                    userDetails.getLoginId(),
                    request.get("currentPassword"),
                    request.get("nextPassword")
            );

            return ResponseEntity.ok(Map.of("message", "비밀번호가 변경되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("handle")
    public ResponseEntity<?> updateHandle(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> request
    ) {
        try {
            // 사용자 아이디 변경은 현재 로그인 사용자 기준으로만 처리한다.
            // 프런트에서 id를 받지 않아야 다른 계정 handle 변경 요청을 막을 수 있다.
            memberService.updateHandle(
                    userDetails.getLoginId(),
                    request.get("memberHandle")
            );

            return ResponseEntity.ok(Map.of("message", "사용자 아이디가 변경되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

}
