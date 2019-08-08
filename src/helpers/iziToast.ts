import iziToast from "izitoast";

export const ErrorMessage = (message: string) => {
    iziToast.show({
        color: 'red',
        message: message,
        position: 'topCenter',
    })
};

export const SuccessMessage = (message: string) => {
    iziToast.show({
        color: 'green',
        message: message,
        position: 'topCenter',
    })
};
