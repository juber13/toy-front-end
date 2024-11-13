export interface ISchoolDetails {
    boardAffiliatedAndMediumOfInstruction?: string;
    code?: string;
    contactDetailsOfCoordinatorTeacher?: string; // done
    contactNumberOfPrincipalManagement?: string; // done
    createdAtIST?: string;
    cupboardPictures?: string;
    district?: string;                      // done
    fullAddressWithPinCode?: string;        // done
    id?: string;
    isThereCupboardForSafekeeping?: string;  // done
    isThereRoomForLibrary?: string;          // done
    nameOfCoordinatorForLibrary?: string;    // done
    nameOfPrincipalAndManagement?: string;   // done
    nameOfSchoolInstitution?: string;
    numberOfStudentsBalwadiClass1?: string;  // done
    numberOfStudentsClass2To4?: string;      // done
    numberOfStudentsClass5AndAbove?: string; // done
    picturesOfLibraryRoomAndCupboard?: string;
    referredBy?: string; // done
    state?: string;     // done
    timestamp?: string; // done
    typeOfInstitutionSchool?: string; // done
    updatedAtIST?: string;
    villageNameIfAny?: string;
    __v?: number; // done
    _id?: string; // done
};

export interface ISchoolOrder {
    id: string;
    timestamp?: string;
    school?: string;
    listOfToysSentLink?: {
        toy: IToy;
        id: string;
        quantity?: number;
    }[];
    dateOfDispatch?: string; //
    modeOfDispatch?: string;
    trackingDetails?: string;
    dateOfDelivery?: string; //
    photosVideosLink?: string;
    createdAtIST?: string;
}

export interface SchoolOrderToyLink {
    toy: string;
    quantity?: number;
}

export interface IToy {
    id?: string;
    brand?: string;
    subBrand?: string;
    name?: string;
    price?: number;
    category?: string;
    codeName?: string;
    cataloguePgNo?: number;
    level?: Level;
    learn?: string[];
    link?: string;
}

export interface IProduct {
    id: string;
    toy: IToy;
    quantity: number;
    link: string;
}

export enum Level {
    ALL = 'ALL',
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY',
    SENIOR_SECONDARY = 'SENIOR_SECONDARY',
    MIX = 'MIX',
};

export interface InfoItem {
    label: string;
    value: string | number | undefined;
}

export interface InfoSectionProps {
    title: string;
    info: InfoItem[];
}