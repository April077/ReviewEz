import prisma from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  const { spaceName } = params;
  console.log(spaceName);

  try {
    const space = await prisma.space.findUnique({
      where: {
        spaceName: spaceName,
      },
      include: {
        reviews: {
          where: {
            liked: true,
          },
        },
      },
    });

    if (!space) {
      return NextResponse.json({ message: "Space not found" }, { status: 404 });
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${space.headerName}</title>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/iframe-resizer/js/iframeResizer.contentWindow.min.js"></script>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            color: #fff; 
            margin: 0; 
            display: flex;
            flex-direction: column; /* Ensures the video and text are stacked vertically */
            justify-content: center; /* Centers the content vertically */
            align-items: center;
          }
          .container {
            display: grid;
            padding: 10px 50px;
            grid-template-columns: 1fr; /* Start with one column by default */
            gap: 20px; /* Spacing between grid items */
          }

          @media (min-width: 600px) {
            .container {
              grid-template-columns: repeat(2, 1fr); /* Switch to 2 columns on medium screens */
              padding: 20px 100px;
            }
          }

          @media (min-width: 1024px) {
            .container {
              grid-template-columns: repeat(3, 1fr); /* Switch to 3 columns on larger screens */
              padding: 50px 150px;
            }
          }


          .review { 
            border-radius: 10px; 
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            overflow: hidden; /* Ensures no elements overflow outside the video wrapper */
          }

          .video-wrapper {
            position: relative;
            width: 100%;
            border-radius: 10px;
            overflow: hidden;
          }
          .video-wrapper video { 
            width: 100%; 
            height: auto; 
            display: block;
            cursor: pointer;
          }
          
          /* Name and stars positioned at the bottom of the video */
          .video-wrapper .video-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
            z-index: 2; /* Ensure it's above the video */
          }
          
          .video-wrapper .video-bottom h2, .video-wrapper .video-bottom .rating {
            margin: 0;
            font-size: 1em;
            color: #f5f5f5;
          }

          .rating {
            display: flex;
            gap: 3px;
          }
          
          .star {
            fill: #FFB621;
            transition: fill .2s ease-in-out;
            width: 24px;
            height: 24px;
          }

          .video-wrapper .play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px; /* Increase width */
  height: 70px; /* Increase height */
  background: rgba(102, 0, 255, 0.8); /* Semi-transparent purple-blue */
  border-radius: 50%; /* Fully round edges */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Add a subtle shadow for emphasis */
}

.video-wrapper .play-button::before {
  content: '';
  display: block;
  border-radius: 10%;
  width: 0;
  height: 0;
  border-left: 30px solid #fff; /* Larger play icon */
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
}

        </style>
      </head>
      <body>
        <div class="container">
          ${space.reviews
            .map(
              (review) => `
            <div class="review">
              <div class="video-wrapper">
                <video src="${review.videoUrl || ""}" id="video-${review.id}" preload="auto"></video>
                <div class="video-bottom">
                  <h2>${review.name}</h2>
                  <div class="rating">
                    ${[...Array(review.rating)]
                      .map(
                        () => `
                      <svg viewBox="0 0 51 48" class=" star">
                        <path class="star" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"></path>
                      </svg>
                    `
                      )
                      .join("")}
                  </div>            
                </div>
                <div class="play-button" onclick="togglePlay('video-${review.id}', this)"></div>
              </div>
              ${review.text ? `<p>${review.text}</p>` : ""}
            </div>
          `
            )
            .join("")}
        </div>
       <script>
  function togglePlay(videoId, playButton) {
    const video = document.getElementById(videoId);
    if (video.paused) {
      video.play();
      playButton.style.display = "none"; // Hide play button when video starts
    } else {
      video.pause();
      playButton.style.display = "flex"; // Show play button when video pauses
    }
  }

  // Event listener to show the play button again when the video ends
  const videos = document.querySelectorAll('video');
  videos.forEach((video) => {
    video.addEventListener('ended', function () {
      const playButton = video.closest('.video-wrapper').querySelector('.play-button');
      playButton.style.display = 'flex'; // Show play button after the video ends
    });
  });
</script>

      </body>
      </html>
    `;

    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
