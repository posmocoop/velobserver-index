const i18n = (() => {
    let default_lang = 'de';
    const messages = {
        'MUST_PROVIDE_NAME': { en: 'You must provide a name.', de: 'Du musst einen Namen angeben.' },
        'MUST_CONFIRM_PASSWORD': { en: 'You must confirm your password.', de: 'Du musst dein Passwort bestätigen.' },
        'PASSWORDS_DO_NOT_MATCH': { en: 'The passwords do not match.', de: 'Die Passwörter stimmen nicht überein.' },
        'MUST_ACCEPT_TOS': { en: 'You still need to accept the terms and conditions.', de: 'Du musst die Nutzungsbedingungen noch akzeptieren.'},
        'MUST_PROVIDE_A_NAME': { en: 'You must provide a name.', de: 'Du musst einen Namen angeben.' },
        'MUST_PROVIDE_AN_EMAIL': { en: 'You must provide an email.', de: 'Du musst eine E-Mail-Adresse angeben.' },
        'EMAIL_IS_NOT_CORRECT': { en: 'This email address is not correct.', de: 'Diese E-Mail-Adresse ist nicht korrekt.' },
        'MUST_PROVIDE_A_PASSWORD': { en: 'You must provide a password.', de: 'Du musst ein Passwort angeben.' },
        'CONNECTED_TO_THE_INTERNET': { en: 'Are you connected to the internet?', de: 'Besteht eine stabile Internetverbindung?' },
        'INVALID_RESET_TOKEN': { en: 'Invalid reset token provided. ', de: 'Es wurde ein ungültiger Rücksetzungstoken verwendet.' },
        'PASSWORD_CHANGED': { en: 'The password has been successfully changed. Redirecting to login in 5s…', de: 'Das Passwort wurde erfolgreich geändert. Du wirst in den nächsten 5 Sekunden zum Login weitergeleitet…' },
        'SOMETHING_WENT_WRONG': { en: 'Something when wrong.', de: 'Etwas lief schief.' },
        /**
         * server messages
         */
        3: { en: 'Wrong username or password', de: 'Falscher Benutzername oder falsches Passwort' },
        4: { en: 'A user with this email already exists.', de: 'Ein Nutzer mit dieser E-Mail-Adresse existiert bereits.' },
        5: { en: 'If you have registered an account, we have sent you an email to reset the password.', de: 'Falls du im Besitz eines Nutzerkontos bist, haben wir dir ein E-Mail zugesandt, um das Passwort zurückzusetzen.' },
    }

    return {
        getLang: () => { return default_lang },
        setLang: (lang) => { default_lang = lang },
        getMessages: () => {
            return messages;
        },
        getMessage: (message_id) => {
            return messages[message_id]
        },
        translate: (message) => {
            return message[default_lang];
        },
    }
})();

export default i18n;