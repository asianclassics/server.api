function parseThirdPartyData(data, itemsArr) {
    const keys = Object.keys(data)
    let new_obj = {}
    itemsArr.forEach((item) => {
        keys.forEach((k) => {
            // using index of to check if the object key name have a matched string
            if (k.indexOf(item) !== -1) {
                new_obj[item] = data[k]
            }
        })
    })
    return new_obj
}

const metadataArray = [
    'email',
    'first_name',
    'last_name',
    'campaign',
    'recurring_donation',
]

module.exports = {
    parseForKindful(data) {
        let { currency, invoice, amount, created, customer } = data
        let recurring = false
        let transaction_type = 'credit'
        let {
            billing_details,
            payment_method_details,
            receipt_email,
            id,
        } = data.charges.data[0]
        let third_party_data = data['metadata']
            ? data['metadata']
            : data.charges.data[0]['metadata']

        let stripe_charge_id = id
        let transaction_time = created
        let transaction_updated_at = Date.now()
        third_party_data = parseThirdPartyData(third_party_data, metadataArray)
        // key settings?
        // $wpsdKeySettings = stripslashes_deep(unserialize(get_option('wpsd_key_settings')));

        // validate data
        // CURRENCY (lowercase)
        currency = currency ? currency : data['charges.data.currency']
        // AMOUNT
        let amount_in_cents = amount ? amount : data['charges.data.amount']
        // GEOGRAPHY, country > state if possible
        let countryCode = 'ZZ'
        if (billing_details['address']['country']) {
            countryCode = billing_details['address']['country']
        } else if (payment_method_details['card']['country']) {
            countryCode = payment_method_details['card']['country']
        }
        // need to ISO2 >>> Country Name

        // EMAIL
        let email = receipt_email
        if (!email) {
            if (billing_details['email']) {
                email = billing_details['email']
            } else if (third_party_data['donorbox_email']) {
                email = third_party_data['donorbox_email']
            } else {
                email = ''
            }
        }

        // PERSON, name
        let first_name = third_party_data['first_name']
            ? third_party_data['first_name']
            : billing_details['name']

        let last_name = third_party_data['first_name']
            ? third_party_data['last_name']
            : ''
        // CAMPAIGN, CAMPAIGN ID
        let campaign = 'DELETE ME YO!'
        // FUND, FUND ID
        let fund = 'ACIP General Fund'
        // RECURRING TRANSACTION & OFFLINE RECURRING vs CREDIT?
        if (invoice) {
            recurring = true
            transaction_type = 'offline_recurring'
        } else if (third_party_data) {
            if (third_party_data['recurring_donation'] === 'true') {
                recurring = true
                transaction_type = 'offline_recurring'
            } else if (!third_party_data['recurring_donation']) {
                recurring = null
                transaction_type = null
            }
        }

        // CREATE DATA OBJECT
        let updatedData = {
            countryCode,
            invoice,
            billing_details,
            payment_method_details,
            third_party_data,
        }

        let match_by = {
            email,
            fund_id: stripe_charge_id,
        }

        let bodyData = {
            data_format: 'contact_with_transaction',
            action_type: 'update',
            data_type: 'json',
            match_by: match_by,
            data: [
                {
                    stripe_charge_id,
                    transaction_time,
                    transaction_updated_at,
                    currency,
                    email,
                    fund,
                    amount_in_cents,
                    first_name,
                    last_name,
                    transaction_type,
                    campaign,
                    customer,
                },
            ],
        }

        // CREATE OBJECT FOR KINDFUL
        // $body_data = array(
        //     "data_format"  => "contact_with_transaction", // check out this endpoint in kindful docs
        //     "action_type" => "update",
        //     "data_type" => "json",
        //     "match_by" => array(
        //         'fund' => 'id',
        //         'campaign' => 'id',
        //         'contact' => 'email',
        //         "custom_field" => "id",
        //     ),
        //     "funds" => array($fund_id),
        //     "campaigns" => array($campaign_id),
        //     "contacts" => array($donation->wpsd_donator_email),
        //     "data" => data object (add this later if custom fields)
        // );

        // DEAL WITH ANY CUSTOM FIELDS (add to data obj)

        // kindful token
        // $token = $wpsdKeySettings['wpsd_kindful_token'];

        // kindful URL
        // $url = $wpsdKeySettings['wpsd_kindful_url']  . "/api/v1/imports";
        // $args = array(
        //     'body' => json_encode($body_data),
        //     'headers' => array(
        //         'Authorization' => 'Token token="' . $token . '"',
        //         'Content-Type' => 'application/json'
        //     )
        // );

        // SEND TO KINDFUL
        // $result = wp_remote_post($url, $args);

        return bodyData
    },
}
