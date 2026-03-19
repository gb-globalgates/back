document.addEventListener("DOMContentLoaded", () => {
    const wrap = document.querySelector(".phone-number-placeholder");
    const input = document.querySelector(".phone-input");
    const field = document.querySelector(".phone-placeholder");
    const labelText = document.querySelector(".phone-text");
    const nextButton = document.querySelector(".next-button");
    const resendButton = document.querySelector(".change");

    if (!wrap || !input || !field || !labelText || !nextButton) return;

    const shrink = () => {
        labelText.style.fontSize = "12px";
        labelText.style.paddingTop = "8px";
        labelText.style.color = "rgb(29, 155, 240)";
    };

    const expand = () => {
        labelText.style.fontSize = "17px";
        labelText.style.paddingTop = "16px";
        labelText.style.color = "rgb(83, 100, 113)";
    };

    const setFocusStyle = () => {
        field.style.borderColor = "rgb(29, 155, 240)";
        field.style.borderWidth = "2px";
    };

    const setNeutralStyle = () => {
        field.style.borderColor = "rgb(207, 217, 222)";
        field.style.borderWidth = "1px";
    };

    const syncNextButton = () => {
        const hasValue = input.value.trim().length > 0;
        nextButton.disabled = !hasValue;
        nextButton.style.opacity = hasValue ? "1" : "0.5";
        nextButton.style.backgroundColor = "rgb(15, 20, 25)";
        nextButton.style.cursor = hasValue ? "pointer" : "default";
    };

    if (input.value.trim().length > 0) {
        shrink();
    } else {
        expand();
    }
    syncNextButton();

    input.addEventListener("focus", () => {
        setFocusStyle();
        shrink();
    });

    input.addEventListener("input", () => {
        if (input.value.trim().length > 0) {
            shrink();
            setFocusStyle();
        }
        syncNextButton();
    });

    input.addEventListener("blur", () => {
        setNeutralStyle();
        if (input.value.trim().length === 0) {
            expand();
        } else {
            shrink();
        }
        syncNextButton();
    });

    if (resendButton) {
        let resendMessage = document.querySelector(".resend-message");
        if (!resendMessage) {
            resendMessage = document.createElement("div");
            resendMessage.className = "resend-message";
            resendMessage.style.display = "none";
            resendMessage.style.color = "rgb(29, 155, 240)";
            resendMessage.style.fontSize = "14px";
            resendMessage.style.marginTop = "8px";
            resendMessage.textContent = "다시 보냈습니다";
            wrap.insertAdjacentElement("afterend", resendMessage);
        }

        resendButton.addEventListener("click", () => {
            resendMessage.style.display = "block";
        });
    }

    const closeButton = document.querySelector(".join-modal-header-close-button, .join-modal-close");
    const modalRoot = document.querySelector(".join-modal, .join-modal-overlay");
    if (closeButton && modalRoot) {
        closeButton.addEventListener("click", () => {
            modalRoot.style.display = "none";
        });
    }
});
