export function generateEmployeeId() {
        return "EMP_" + Date.now().toString().slice(-6);
}