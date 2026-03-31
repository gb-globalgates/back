const settingService = (() => {
    // 설정 화면의 비밀번호 확인은 현재 로그인한 사용자 기준으로만 검사한다.
    // join의 중복검사 서비스와 같은 형태를 유지해서, event.js는 boolean 결과만 보고 흐름을 결정한다.
    const checkPassword = async (password, callback) => {
        const response = await fetch(`/api/settings/check-password?memberPassword=${password}`);
        const text = await response.text();

        if (!response.ok) {
            throw new Error(text || "Fetch error");
        }

        const isMatched = text === "true";
        if (callback) callback(isMatched);
        return isMatched;
    };

    // 비밀번호 변경은 현재 비밀번호와 새 비밀번호만 서버에 전달한다.
    // 확인 비밀번호는 화면 UX용 비교값이므로 프런트에서만 검사하고 서버에는 보내지 않는다.
    const updatePassword = async (currentPassword, nextPassword) => {
        const response = await fetch("/api/settings/password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                nextPassword: nextPassword,
            }),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.message || "비밀번호 변경 실패");
        }

        return result;
    };

    // 비밀번호 변경 직후에는 기존 세션을 바로 정리하고 재로그인을 요구한다.
    // 이 프로젝트는 /api/auth/logout이 access/refresh 쿠키를 함께 정리하므로 추가 쿠키 처리는 필요 없다.
    const logout = async () => {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
        });

        if (!response.ok) {
            throw new Error("로그아웃 실패");
        }
    };

    // 사용자 아이디 중복검사는 join의 기존 handle 검사 API를 그대로 재사용한다.
    // setting 화면은 "현재 입력값이 사용 가능한지"만 알면 되므로 boolean 하나만 반환받아 처리한다.
    const checkHandle = async (memberHandle) => {
        const response = await fetch(`/api/member/check-handle?memberHandle=${encodeURIComponent(memberHandle)}`);
        const text = await response.text();

        if (!response.ok) {
            throw new Error(text || "사용자 아이디 중복검사 실패");
        }

        return text === "true";
    };

    // handle 저장 대상은 항상 현재 로그인 사용자다.
    // 프런트는 raw handle만 보내고, 저장 포맷(@ 포함 여부)은 서버에서 최종 정리한다.
    const updateHandle = async (memberHandle) => {
        const response = await fetch("/api/settings/handle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                memberHandle: memberHandle,
            }),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.message || "사용자 아이디 변경 실패");
        }

        return result;
    };

    return {
        checkPassword: checkPassword,
        updatePassword: updatePassword,
        logout: logout,
        checkHandle: checkHandle,
        updateHandle: updateHandle,
    };
})();
