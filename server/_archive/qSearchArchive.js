const intervals = {
    intervals: {
        field_to_search: {
            all_of: {
                ordered: false,
                max_gaps: 120,
                intervals: [
                    {
                        match: {
                            query: 'michael roach',
                            max_gaps: 0,
                            ordered: false,
                        },
                    },
                    {
                        match: {
                            query: 'student',
                            max_gaps: 0,
                            ordered: false,
                        },
                    },
                ],
            },
        },
    },
}
