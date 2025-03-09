import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

function StoryDetail() {
    const stories = [
        {
            name: "Anh Nam",
            time: "5 giờ",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            image: "https://scontent.fhph1-2.fna.fbcdn.net/v/t39.30808-6/444224638_1810049186168123_3858743644048692914_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGNs02cr2G0gsDscbrUEc6BVce7z4bOOCZVx7vPhs44Jn5cVc3dUJp33IiBZxrUYGUP8D1BpKAL1g-8tJoGablH&_nc_ohc=gbXhxS_zy60Q7kNvgGkXw8h&_nc_oc=Adi-JB7B6F_e-iAUHPYecr-qxuyZErciPjEWZm7oS-QmLdeXrK35e-X1qWiyiiEUu1z8Rh6gaBfDtfnXLDEKtr9I&_nc_zt=23&_nc_ht=scontent.fhph1-2.fna&_nc_gid=A-2oMLNJXND30INE8IThTtF&oh=00_AYBNMuyL7S8Xhu7_WALV2wAIsEJSj9pP9GWJYnVdMF3yLg&oe=67C8DE2F"
        },
        {
            name: "Phạm Thị Thu Hà",
            time: "6 giờ",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            image: "https://scontent.fhph1-3.fna.fbcdn.net/v/t39.30808-6/472706218_1969969310176109_4433828159822282862_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFZz7GMzT-X-MR2cBAdRflDZOsLac64uBJk6wtpzri4Ei5dcvGWQpuoe2QsHJdGEu_Qy-V0jCOQNtHY8eN1v1zO&_nc_ohc=mtQsXu8ymzsQ7kNvgFqlz81&_nc_oc=AdhLvGt-zaX242xrTBOZUpcaK8nOd1wBIGNp7PffhSMvYLb1LAj1SSxR6RF_oTC6LFG4z3It7N5Nsrkpx8FiR4yT&_nc_zt=23&_nc_ht=scontent.fhph1-3.fna&_nc_gid=AKnTPWIszRHcAsRFeNogv1E&oh=00_AYC3ybeonWIC2I5NTAY-FxIR3LWEcGEkap2A6FnjoCgzQw&oe=67C8EB28"
        },
        {
            name: "Tra My",
            time: "1 giờ",
            avatar: "https://randomuser.me/api/portraits/women/2.jpg",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
        },
    ];

    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setProgress((prev) => {
    //             if (prev >= 100) {
    //                 nextStory(); // Chuyển sang story tiếp theo khi đầy
    //                 return 0; // Reset progress về 0
    //             }
    //             return prev + 1;
    //         });
    //     }, 100); // Giảm tốc độ (từ 50ms thành 100ms, tổng thời gian: 10 giây)

    //     return () => clearInterval(interval);
    // }, [currentStoryIndex]); // Reset mỗi lần đổi story

    const nextStory = () => {
        if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
            setProgress(0);
        }
    };

    const prevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1);
            setProgress(0);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white" style={{ width: "60vw" }}>
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-900 p-4">
                <h2 className="text-lg font-semibold mb-4">Tin</h2>
                <div>
                    <h3 className="text-sm text-gray-400 mb-4">Tin của bạn </h3>
                    <div className="flex items-center mb-6">
                        <a href="/story-up" className="relative">
                            <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-blue-400 text-3xl font-bold">+</span>
                            </div>
                        </a>
                        <div className="ml-3">
                            <p className="font-semibold">Tạo tin</p>
                            <p className="text-sm text-gray-400">Bạn có thể chia sẻ tin của mình ở đây</p>
                        </div>
                    </div>  

                    <h3 className="text-sm text-gray-400 mb-4">Tất cả tin</h3>
                    {stories.map((story, index) => (
                        <div
                            key={index}
                            className={`flex items-center mb-4 cursor-pointer hover:bg-gray-800 p-2 rounded-lg ${
                                index === currentStoryIndex ? "bg-gray-800" : ""
                            }`}
                            onClick={() => setCurrentStoryIndex(index)}
                        >
                            <img src={story.avatar} alt={story.name} className="w-10 h-10 rounded-full mr-3" />
                            <div>
                                <p className="font-semibold">{story.name}</p>
                                <p className="text-sm text-gray-400">{story.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Story Content */}
            <div className="flex-1 flex flex-col items-center p-4">
                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-500 rounded-full relative my-2">
                    <div className="h-1 bg-white rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>

                {/* Header */}
                <div className="w-full flex justify-between items-center mb-4 relative">
                    <div className="flex items-center">
                        <img src={stories[currentStoryIndex].avatar} alt="Story Owner" className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <p className="font-semibold">{stories[currentStoryIndex].name}</p>
                            <p className="text-sm text-gray-400">{stories[currentStoryIndex].time}</p>
                        </div>
                    </div>

                    <button onClick={() => window.history.back()} className="absolute right-4 text-white hover:text-gray-300">
                        <FaTimes className="text-2xl" />
                    </button>
                </div>

                {/* Images */}
                <div className="relative w-full flex flex-col gap-4">
                    {/* Nút Sang Trái */}
                    {currentStoryIndex > 0 && (
                        <button
                            onClick={prevStory}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                        >
                            <FaChevronLeft className="text-lg" />
                        </button>
                    )}

                    {/* Hình Ảnh */}
                    <img
                        src={stories[currentStoryIndex].image}
                        alt={`Story Image ${currentStoryIndex + 1}`}
                        className="w-full h-auto object-cover rounded-lg"
                        style={{ height: "500px" }}
                    />

                    {/* Nút Sang Phải */}
                    {currentStoryIndex < stories.length - 1 && (
                        <button
                            onClick={nextStory}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                        >
                            <FaChevronRight className="text-lg" />
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="w-full flex items-center justify-between mt-4">
                    <input type="text" placeholder="Trả lời..." className="flex-1 bg-gray-800 text-gray-300 p-2 rounded-lg mr-4" />
                    <div className="flex space-x-2">
                        <button className="text-gray-400">👍</button>
                        <button className="text-gray-400">❤️</button>
                        <button className="text-gray-400">😮</button>
                        <button className="text-gray-400">😢</button>
                        <button className="text-gray-400">😡</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoryDetail;
