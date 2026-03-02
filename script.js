// script.js
document.addEventListener("DOMContentLoaded", () => {
    // กำหนดจับ Elements ต่าง ๆ ในหน้า
    const envClosed = document.getElementById("env-closed"); // ภาพที่ 1 ของ image (ซองเปิด)
    const envOpenArea = document.getElementById("env-open-area");
    const envOpen = document.getElementById("env-open"); // ภาพที่ 2 ของ image (ซองเปิดแล้ว)
    const letterThumbOrigin = document.getElementById("letter-thumb"); // ภาพ 1 ของ letter

    const fullscreenOverlay = document.getElementById("fullscreen-overlay");
    const closeOverlay = document.getElementById("close-overlay");
    const fullscreenImg = document.getElementById("fullscreen-img");

    const buttonWrapper = document.getElementById("button-wrapper");
    const btn4 = document.getElementById("btn-4");
    const btn5 = document.getElementById("btn-5");

    let hasPlayedInitialAnimation = false;
    let hasViewedLetterFull = false;

    // 1. กดที่ซอง (ภาพที่ 1) -> ซองจะเปลี่ยนเป็นซองเปิด (ภาพที่ 2) + เล่นอนิเมชันจดหมายโผล่ขึ้นมา
    envClosed.addEventListener("click", () => {
        envClosed.style.display = "none";
        envOpenArea.style.display = "flex";

        // เริ่มเล่นแอนิเมชันให้จดหมายโผล่
        letterThumbOrigin.classList.add("slide-up");
        hasPlayedInitialAnimation = true;
    });

    // 2. เมื่ออนิเมชันจดหมายโผล่เสร็จเรียบร้อยแล้ว -> ขยายจดหมายเต็มจอให้อ่าน
    letterThumbOrigin.addEventListener("animationend", (e) => {
        if (e.animationName === "letterSlideUp") {
            openFullscreen();
        }
    });

    // ให้ผู้ใช้คลิกจดหมายที่ขนาดย่อ เพื่อเปิดดูใหม่แบบเต็มจอได้
    letterThumbOrigin.addEventListener("click", () => {
        if (hasPlayedInitialAnimation) {
            openFullscreen();
        }
    });

    function openFullscreen() {
        fullscreenOverlay.style.display = "flex";

        // Trigger reflow เพื่อให้ transition ทำงาน
        void fullscreenOverlay.offsetWidth;

        fullscreenOverlay.classList.add("show");
    }

    // 3. ปิดจดหมายหน้าเต็ม -> เปลี่ยนกลับเป็นภาพขนาดย่อ และเตรียมโชว์ปุ่มภาพที่ 4
    const closeLetter = () => {
        fullscreenOverlay.classList.remove("show");

        // คงจดหมายขนาดเล็กไว้ให้อยู่ในสถานะหลังเลื่อนเสร็จ ไม่รีเซ็ตอนิเมชัน
        letterThumbOrigin.style.animation = "none";
        letterThumbOrigin.style.transform = "translateY(-45%)"; // ตรงกับปลายทางของ keyframe
        letterThumbOrigin.style.opacity = "1";

        setTimeout(() => {
            fullscreenOverlay.style.display = "none";
            // ถ้าเปิดดูและปิดเป็นครั้งแรก ให้แสดงปุ่มที่ด้านล่างรัวๆ
            if (!hasViewedLetterFull) {
                hasViewedLetterFull = true;
                buttonWrapper.style.display = "block";
            }
        }, 400); // 400ms ตามเวลา transition ใน css
    };

    closeOverlay.addEventListener("click", closeLetter);
    fullscreenImg.addEventListener("click", closeLetter);

    // 4. คลิกปุ่มภาพ 4 -> ปุ่มเปลี่ยนเป็นภาพ 5 และเล่นอนิเมชันเงินตกลงมา
    btn4.addEventListener("click", () => {
        btn4.style.display = "none";
        btn5.style.display = "block";

        startMoneyAnimation();
    });

    // 5. ระบบอนิเมชันเงินตกลงมา
    function startMoneyAnimation() {
        const moneyContainer = document.getElementById("money-container");

        // รายการภาพเงินที่ใช้สุ่ม
        const moneyImages = [
            "image/6.png",
            "image/7.png",
            "image/8.png",
            "image/9.png",
            "image/10.png"
        ];

        let moneyInterval;
        let isActive = true; // เอาไว้เช็คให้หยุดทำงานหลังจาก 20 วิ

        const spawnMoney = () => {
            if (!isActive) return;

            const img = document.createElement("img");

            // สุ่มภาพ 6,7,8,9,10
            const randomImg = moneyImages[Math.floor(Math.random() * moneyImages.length)];
            img.src = randomImg;
            img.classList.add("money-item");

            // สุ่มตำแหน่งจุดตกจากแกน X (บนขอบบนจอ)
            const randomX = Math.random() * 100;
            img.style.left = `${randomX}vw`;

            // สุ่มขนาดให้ดูมีมิติตื้นลึก
            const size = Math.floor(Math.random() * 80) + 60; // ย่อขยายสุ่มขนาดตั้งแต่ 60px ถึง 140px
            img.style.width = `${size}px`;

            // สุ่มระยะเวลาตก (ความเร็ว) ประมาณ 3-6 วินาที
            const duration = Math.random() * 3 + 3;
            img.style.animationDuration = `${duration}s`;

            // ทำให้การตกดูหมุนแตกต่างกันไปอีกด้วย
            const randomDelay = Math.random() * 0.5;
            img.style.animationDelay = `${randomDelay}s`;

            // แปะเงินลง Container
            moneyContainer.appendChild(img);

            // ลบรูปออกจาก Document เมื่อตกถึงพื้นเรียบร้อย เพื่อประหยัดเมมโมรี่
            setTimeout(() => {
                if (img.parentNode === moneyContainer) {
                    moneyContainer.removeChild(img);
                }
            }, (duration + randomDelay) * 1000);
        };

        // เสกภาพเงินลงมาทุกๆ 200 milliseconds (0.2 วิ)
        moneyInterval = setInterval(spawnMoney, 200);

        // หลังจาก 20 วินาทีตามที่ผู้ใช้กำหนด (20,000 milliseconds) ก็หยุดการเสก
        setTimeout(() => {
            isActive = false;
            clearInterval(moneyInterval);
        }, 20000);
    }
});
