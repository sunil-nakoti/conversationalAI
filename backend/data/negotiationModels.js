const initialNegotiationModels = [
    {
        id: 'nm_standard',
        name: 'Standard Collections Model',
        description: 'A balanced approach suitable for most portfolios.',
        settlementAuthority: { maxPercentage: 40, requiresApprovalSimulation: true },
        offerPacing: 'gradual',
        paymentPlanFlexibility: { allowCustomPlans: false, maxDurationMonths: 12, minInstallmentPercentage: 5 },
        hardshipProtocol: 'link_to_hardship_playbook',
        allowedTactics: ['expiring_offer'],
    },
    {
        id: 'nm_empathetic',
        name: 'Empathetic Hardship Model',
        description: 'Prioritizes listening and offering flexible plans. Lower settlement authority.',
        settlementAuthority: { maxPercentage: 25, requiresApprovalSimulation: false },
        offerPacing: 'last_resort',
        paymentPlanFlexibility: { allowCustomPlans: true, maxDurationMonths: 24, minInstallmentPercentage: 2 },
        hardshipProtocol: 'offer_pause',
        allowedTactics: [],
    },
    {
        id: 'nm_aggressive',
        name: 'Aggressive Settlement Model',
        description: 'Focuses on securing larger one-time payments quickly.',
        settlementAuthority: { maxPercentage: 60, requiresApprovalSimulation: true },
        offerPacing: 'immediate',
        paymentPlanFlexibility: { allowCustomPlans: false, maxDurationMonths: 3, minInstallmentPercentage: 25 },
        hardshipProtocol: 'link_to_hardship_playbook',
        allowedTactics: ['expiring_offer', 'payment_in_full_discount'],
    }
];

module.exports = initialNegotiationModels;
