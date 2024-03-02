export function getAvatarImage (avatar: string): string {
    // hash avatar string down to a number between 1 and 106
    const hash = avatar.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const number = hash % 106 + 1
    return `/profile-images/${number}.jpg`
}
