export async function deleteSchedule(slug: string, publishTime: string) {
    const now = new Date();
    const publishDate = new Date(publishTime);
    const difference = publishDate.getTime() - now.getTime();

    try {
        if (difference > 0) {
            const res = await fetch("https://zzfcus8v5k.execute-api.ap-south-1.amazonaws.com/prod/release-post-schedule-manually", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.API_KEY!
                },
                body: JSON.stringify({ slug })
            });
            
            if(!res.ok) throw new Error("Failed to delete schedule");

            const data = await res.json();
            return data;
        }
    } catch (error) {
        console.error("Error deleting schedule:", error);
    }
}
