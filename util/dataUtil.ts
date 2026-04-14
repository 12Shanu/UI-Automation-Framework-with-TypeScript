export function generateEmployeeId() {
        return "EMP_" + Date.now().toString().slice(-6);
}

export function generateUsername() {
        return "SHN_" + Date.now().toString().slice(-6);
}